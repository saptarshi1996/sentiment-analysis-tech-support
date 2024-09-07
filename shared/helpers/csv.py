import csv
import io


def read_csv(file_content):
    content_decoded = file_content.decode()
    csv_reader = csv.reader(io.StringIO(content_decoded))

    headers = next(csv_reader)
    rows = [dict(zip(headers, row)) for row in csv_reader]

    return rows


def write_csv(records, header):
    output = io.StringIO()
    csv_writer = csv.writer(output)

    # Write the header
    csv_writer.writerow(header)

    # Write the records
    for record in records:
        csv_writer.writerow([record.get(field, '') for field in header])

    output.seek(0)
    return output
