import os
from rembg import remove
from PIL import Image

input_path = r'C:\Users\IK\.gemini\antigravity-ide\brain\75e83cff-94be-412a-94fe-cb2afa0f84a1\media__1783703713714.png'
output_path = r'c:\Users\IK\Documents\GitHub\recargashark\img\logo.png'

print(f"Removing background for {input_path}...")
try:
    with open(input_path, 'rb') as i:
        input_data = i.read()
    output_data = remove(input_data)
    with open(output_path, 'wb') as o:
        o.write(output_data)
    print("Background removed successfully!")
    
    # Now create favicons
    img = Image.open(output_path)
    
    sizes = [(32, 32), (192, 192), (512, 512)]
    for size in sizes:
        resized = img.resize(size, Image.Resampling.LANCZOS)
        filename = f'c:\\Users\\IK\\Documents\\GitHub\\recargashark\\img\\favicon-{size[0]}.png'
        resized.save(filename)
        print(f"Saved {filename}")

    print("Replaced logo.png and all favicons with the NEW transparent version.")

except Exception as e:
    print(f"Error: {e}")
