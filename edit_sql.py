import os
import sys
import glob

def edit_sql(file, country_id):
	edited_lines = [] 
	with open(file, 'r') as f:
		for line in f:
			line = line.strip()
			line += f' WHERE COUNTRY_ID = {country_id}'
			line = line[:6] + " [UID], [COUNTRY_ID], " + line[7:]
			idx = line.find(' from ')
			line = line[:idx] + ", [LAST_INSERTED_DT_TIME], [LAST_LOAD_DT_TIME]" + line[idx:]

			edited_lines.append(line)

	return '\n'.join(edited_lines)


def main(input_folder, output_folder):
	"""
	Edit SQL query according to country IDs.
	Files are to be named according to the country IDs of the set of SQL queries.
	Eg. Country ID = 1 -> Filename = 1.txt
	
	:param input_folder: Folder containing the input files
	:param output_folder: Folder to save the output files
	"""

	input_files = glob.glob(f'{input_folder}/*')

	os.mkdir(output_folder)

	for input_file in input_files:
		country_id = input_file[3:-4]

		output_filename = f'{output_folder}/{country_id}_edited.txt'

		with open(output_filename, 'w') as output_file:
			output_file.write(edit_sql(input_file, country_id))


if __name__ == "__main__":
	main(sys.argv[1], sys.argv[2])