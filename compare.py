import sys
import json
import ast

data_to_pass_back = sys.argv[2]

input = ast.literal_eval(sys.argv[1])
output = input
output.append(data_to_pass_back)
print(json.dumps(output))

sys.stdout.flush()


#above make the thing so that it appends it and makes it better. yk