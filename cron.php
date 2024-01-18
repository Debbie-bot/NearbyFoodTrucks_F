<?php

$file = 'Mobile_Food_Facility_Permit.csv';

if (file_exists($file)) {
    $handle = fopen($file, 'r');

    $keys = $foodTrucks = [];
    while (($data = fgetcsv($handle)) !== false) {
        if (!$keys) {
            $keys = $data;
            continue;
        } else {
            $truck = array_combine($keys, $data);
            if ($truck['Status'] != 'APPROVED') {
                continue;
            }
            $foodTrucks[] = [
                'name' => $truck['Applicant'],
                'latitude' => $truck['Latitude'],
                'longitude' => $truck['Longitude'],
                'address' => $truck['LocationDescription'] ?: $truck['Address'],
                'foodItems' => $truck['FoodItems'],
            ];
        }
    }
    fclose($handle);

    $json = json_encode($foodTrucks);
    file_put_contents('data.json', $json);
} else {
    echo "File not found.";
}
?>