# This script is used to construct the "Formulas for APAC" column at https://docs.google.com/spreadsheets/d/1hcuT1pSF67h68tptNEP3OKJxNoyFNwicwQCHsDOwB-E/edit?ts=5f2a1ec0#gid=1747107633

import os
import sys
import glob
import csv

def build_dax(file):
    """
    Construct DAX for "Formulas for APAC" column.
    
    Parameters:
        file (str): CSV file to be worked on.
        
    Returns:
        res (str): A string of all DAX with each DAX in its own row.
    """
    
    # list to store DAX for each row
    lst_dax = []

    with open(file, encoding="utf8") as f:
        f = csv.reader(f)

        # skip first 3 rows
        _ = next(f)
        _ = next(f)
        _ = next(f)
        
        # construct DAX and store each one to `lst_dax`
        for en_title, cn_title, jp_title, eu_formula, apac_formula in f:
            new_dax = f'{eu_formula[:eu_formula.find("=")]}= IF(SELECTEDVALUE(\'Language\'[Language Code])= \"EN\" , \"{en_title}\", IF(SELECTEDVALUE(\'Language\'[Language Code])= \"CN\" , \"{cn_title}\", IF(SELECTEDVALUE(\'Language\'[Language Code])= \"JP\" , \"{jp_title}\")))' 

            lst_dax.append(new_dax)

        # join all DAX with new line character
        res = '\n'.join(lst_dax)

    return res
    
    
def main(input_folder, output_folder):
    """
    Runs `build_dax` function on all files from `input_folder`
    and store them in `output_folder`.
    
    Parameters:
        input_folder (str): Folder containing the input files.
        output_folder (str): Folder to save the output files.
        
    Returns:
        (null): Folder with given `output_folder` name containing all output files 
    """

    # get all files from `input_folder`
    input_files = glob.glob(f'{input_folder}/*')

    # make a new folder with given `output_folder` as name
    os.mkdir(output_folder)

    # process each file from `input_folder`
    for input_file in input_files:
        print(input_file)
        
        # construct output filename with "-done.txt" at the end
        output_filename = f'{output_folder}/{input_file[3:-4]}-done.txt'
        
        # write the contents returned by `build_dax` into output file
        with open(output_filename, 'w', encoding="utf8") as output_file:
            output_file.write(build_dax(input_file))

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])