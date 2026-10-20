"""Real-ESRGAN general-x4v3 (SRVGGNetCompact) without torch: load .pth, build ONNX, run onnxruntime."""
import sys, zipfile, pickle, collections, numpy as np
import onnx
from onnx import helper, TensorProto, numpy_helper
import onnxruntime as ort
from PIL import Image

def load_pth(path):
    z = zipfile.ZipFile(path)
    pre = z.namelist()[0].split('/')[0]
    class Storage:
        def __init__(s, key, dtype): s.key, s.dtype = key, dtype
    class U(pickle.Unpickler):
        def find_class(s, mod, name):
            if name == 'FloatStorage': return 'f4'
            if name == '_rebuild_tensor_v2':
                def rb(st, off, size, stride, *a):
                    raw = np.frombuffer(z.read(f'{pre}/data/{st.key}'), dtype=st.dtype)
                    n = int(np.prod(size)) if size else 1
                    return np.lib.stride_tricks.as_strided(raw[off:], shape=size, strides=[x * 4 for x in stride]).copy() if size else raw[off:off + 1].copy()
                return rb
            if mod == 'collections' and name == 'OrderedDict': return collections.OrderedDict
            return super().find_class(mod, name)
        def persistent_load(s, pid): return Storage(pid[2], pid[1] if isinstance(pid[1], str) else 'f4')
    d = U(z.open(f'{pre}/data.pkl')).load()
    return d.get('params', d.get('params_ema', d))

import os
MODEL = os.environ.get('ESRGAN_PTH', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'realesr-general-x4v3.pth'))
sd = load_pth(MODEL)
keys = list(sd.keys())
nodes, inits = [], []
def init(name, arr): inits.append(numpy_helper.from_array(arr.astype(np.float32), name)); return name
x = 'input'; i = 0; li = 0
idx = sorted({int(k.split('.')[1]) for k in keys})
for n in idx:
    w = sd.get(f'body.{n}.weight')
    if w is not None and w.ndim == 4:
        out = f'c{n}'; nodes.append(helper.make_node('Conv', [x, init(f'w{n}', w), init(f'b{n}', sd[f'body.{n}.bias'])], [out], pads=[1, 1, 1, 1])); x = out
    elif w is not None:  # PReLU
        out = f'p{n}'; nodes.append(helper.make_node('PRelu', [x, init(f'a{n}', w.reshape(-1, 1, 1))], [out])); x = out
nodes.append(helper.make_node('DepthToSpace', [x], ['ps'], blocksize=4, mode='CRD'))
nodes.append(helper.make_node('Resize', ['input', '', init('scales', np.array([1, 1, 4, 4], np.float32))], ['up'], mode='nearest'))
nodes.append(helper.make_node('Add', ['ps', 'up'], ['output']))
g = helper.make_graph(nodes, 'sr', [helper.make_tensor_value_info('input', TensorProto.FLOAT, [1, 3, None, None])], [helper.make_tensor_value_info('output', TensorProto.FLOAT, [1, 3, None, None])], inits)
m = helper.make_model(g, opset_imports=[helper.make_opsetid('', 17)]); m.ir_version = 8
sess = ort.InferenceSession(m.SerializeToString(), providers=['CPUExecutionProvider'])

for src, dst in zip(sys.argv[1::2], sys.argv[2::2]):
    im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32) / 255
    y = sess.run(None, {'input': im.transpose(2, 0, 1)[None]})[0][0]
    Image.fromarray((np.clip(y.transpose(1, 2, 0), 0, 1) * 255 + .5).astype(np.uint8)).save(dst)
    print(src, '->', dst, y.shape)
