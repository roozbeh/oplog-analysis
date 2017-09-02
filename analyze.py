import csv
with open('operations.csv', 'rb') as csvfile:
  operations = csv.reader(csvfile, delimiter=',', quotechar='|')
  op_times = dict()
  op_bytes = dict()
  for op in operations:
    op_str = "%s_%s" % (op[0], op[1])
    if op_str in op_times:
      op_times[op_str] = op_times[op_str] + 1
      op_bytes[op_str] = op_bytes[op_str] + int(op[2])
    else:
      op_times[op_str] = 1
      op_bytes[op_str] = int(op[2])
      
  total_bytes = 0
  for op, bytes in op_bytes.iteritems():
    total_bytes = total_bytes + bytes
    
  print "total: %d" % (total_bytes)
    
  for op, count in op_times.iteritems():
    print "%d byte for Operation: %s, Count: %d, %g %%" % (op_bytes[op], op, count , (100 * op_bytes[op]/total_bytes))
