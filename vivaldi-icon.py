# alpha, set image w/ white background and black icon to 50% opacity
from PIL import Image

im = Image.open('image.png', 'r')
im.putalpha(128)  # set 50% transparency
im.save('image-alpha.png')


# gamma, set black background of image w/ white icon to 0% opacity
from PIL import Image

img = Image.open('img.png')
img = img.convert("RGBA")
datas = img.getdata()

newData = []
for item in datas:
	# if pixel is white (255,255,255), set it's transparency to 0 (255,255,255,0)
	# else remain
    if item[0] == 255 and item[1] == 255 and item[2] == 255:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)

img.putdata(newData)
img.save("img2.png", "PNG")
