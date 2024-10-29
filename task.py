

import os
import json
from collections import OrderedDict

# Set the directory where your numbered folders are located
parent_directory = 'assets/N5_Listening_ext'

# Initialize the JSON dictionary
json_data = OrderedDict()

# Get a sorted list of folder names (sorted in ascending order)
folders = sorted([folder for folder in os.listdir(parent_directory) if os.path.isdir(os.path.join(parent_directory, folder))], key=int)

# Loop through all folders in ascending order
for folder_name in folders:
    folder_path = os.path.join(parent_directory, folder_name)

    # Initialize an OrderedDict for each entry to maintain key order
    entry = OrderedDict()
    
    # Track if there's an image file
    has_image = False
    
    # Traverse through files in each folder
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        # If it's an mp3 file, rename it and add to JSON data
        if filename.endswith('.mp3'):
            new_audio_filename = f'audio_{folder_name}.mp3'
            new_audio_path = os.path.join(folder_path, new_audio_filename)
            os.rename(file_path, new_audio_path)
            entry["audio_path"] = f"{folder_name}/{new_audio_filename}"

        # If it's a jpg file, rename it and add to JSON data
        elif filename.endswith('.jpg'):
            new_image_filename = f'image_{folder_name}.jpg'
            new_image_path = os.path.join(folder_path, new_image_filename)
            os.rename(file_path, new_image_path)
            entry["image_path"] = f"{folder_name}/{new_image_filename}"
            has_image = True
    
    # Add "answer" field after audio and image (if exists)
    entry["answer"] = ""

    # Add the entry to the json_data dictionary with the folder name as the key
    json_data[folder_name] = entry

# Save the json_data to a JSON file, ensuring key order is maintained
json_output_path = os.path.join(parent_directory, 'output.json')
with open(json_output_path, 'w', encoding='utf-8') as json_file:
    json.dump(json_data, json_file, ensure_ascii=False, indent=4)

print(f"JSON file created at: {json_output_path}")
