from PIL import Image

def remove_black_background(input_path, output_path, tolerance=30):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Check if the pixel is dark (close to black)
        if item[0] < tolerance and item[1] < tolerance and item[2] < tolerance:
            # Change the black (or near black) pixel to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print("Background removed successfully!")

remove_black_background("logo.jpg", "logo.png")
