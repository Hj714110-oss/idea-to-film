"""Key product footage shot on pure black into 8-bit mattes, one per frame.
usage: python3 matte.py <clips_dir> <matte_dir> name [name ...]   (clips_dir/name/0001.jpg ...)"""
import cv2, numpy as np, os, sys
src, dst = sys.argv[1], sys.argv[2]
for name in sys.argv[3:]:
    os.makedirs(f'{dst}/{name}',exist_ok=True)
    for fn in sorted(os.listdir(f'{src}/{name}')):
        im=cv2.imread(f'{src}/{name}/{fn}'); g=im.max(2)
        m=(g>6).astype(np.uint8)
        m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
        # fill small enclosed holes (deep shadows inside the product), keep real gaps
        inv=1-m; n,lab,st,_=cv2.connectedComponentsWithStats(inv,connectivity=4)
        for k in range(1,n):
            x,y,w,h,a=st[k]
            if a<2500 and x>0 and y>0 and x+w<m.shape[1] and y+h<m.shape[0]: m[lab==k]=1
        # drop tiny specks of noise
        n,lab,st,_=cv2.connectedComponentsWithStats(m,connectivity=8)
        for k in range(1,n):
            if st[k][4]<400: m[lab==k]=0
        m=cv2.erode(m,np.ones((3,3),np.uint8))
        a=cv2.GaussianBlur(m.astype(np.float32)*255,(0,0),1.2)
        cv2.imwrite(f'{dst}/{name}/{fn}',a.astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,88])
    print(name,'done',flush=True)
