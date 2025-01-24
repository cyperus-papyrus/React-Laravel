<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Ceo;
use App\Models\Employee;
use Illuminate\Support\Facades\File;

class ImportEmployees extends Command
{
    protected $signature = 'import:employees {file}';
    protected $description = 'Import employees from a JSON file';

    public function handle()
    {
        $filePath = $this->argument('file');

        if (!File::exists($filePath)) {
            $this->error('File not found!');
            return;
        }

        $json = File::get($filePath);
        $data = json_decode($json, true);

        foreach ($data['company']['ceo'] as $ceoData) {
            Ceo::create([
                'name' => $ceoData['name'],
                'position' => $ceoData['position'],
                'avatar' => $ceoData['avatar'],
            ]);
        }

        foreach ($data['company']['employees'] as $employeeData) {
            $this->importEmployee($employeeData);
        }

        $this->info('Employees imported successfully!');
    }

    protected function importEmployee($employeeData, $chiefId = null)
    {
        \Log::info("Importing employee: ", ['name' => $employeeData['name'], 'chief_id' => $chiefId]);
    
        $employee = Employee::create([
            'name' => $employeeData['name'],
            'position' => $employeeData['position'],
            'avatar' => $employeeData['avatar'] ?? null,
            'chief_id' => $chiefId,
        ]);

        if (isset($employeeData['subordinates'])) {
            foreach ($employeeData['subordinates'] as $subordinateData) {
                $this->importEmployee($subordinateData, $employee->id);
            }
        }
    }
}