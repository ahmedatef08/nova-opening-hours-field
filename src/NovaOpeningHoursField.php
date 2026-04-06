<?php

namespace SadekD\NovaOpeningHoursField;

use Illuminate\Validation\ValidationException;
use Laravel\Nova\Fields\Field;
use Laravel\Nova\Fields\SupportsDependentFields;
use Laravel\Nova\Http\Requests\NovaRequest;
use Spatie\OpeningHours\Exceptions\Exception as OpeningHoursException;
use Spatie\OpeningHours\OpeningHours;

class NovaOpeningHoursField extends Field
{
    use SupportsDependentFields;

    public $component = 'nova-opening-hours-field';

    private $allowOverflowMidnight;
//    private $allowMergeOverlapping;

    public function __construct($name, $attribute = null, $resolveCallback = null)
    {
        parent::__construct($name, $attribute, $resolveCallback);

        $this->allowExceptions(TRUE);
        $this->allowOverflowMidnight(FALSE);
        $this->useTextInputs(FALSE);
//        $this->allowMergeOverlapping(TRUE);
    }

    protected function fillAttributeFromRequest(NovaRequest $request, $requestAttribute, $model, $attribute)
    {
        if ($request->exists($requestAttribute)) {
            $value = json_decode($request[$requestAttribute], TRUE);

            $openingHoursForValidation = $this->normalizeValueForValidation($value ?: []);

            $data = array_merge([
                'overflow' => (bool)$this->allowOverflowMidnight,
            ], $openingHoursForValidation);

//            if ($this->allowMergeOverlapping) {
//                $data = OpeningHours::mergeOverlappingRanges($data);
//            }

            try {
                OpeningHours::create($data);
            } catch (OpeningHoursException $exception) {
                throw ValidationException::withMessages([$requestAttribute => $exception->getMessage()]);
            }

            $model->{$attribute} = $this->isNullValue($request[$requestAttribute]) ? NULL : $value;
        }
    }

    public function allowExceptions(bool $value)
    {
        return $this->withMeta(['allowExceptions' => $value]);
    }

    public function allowOverflowMidnight(bool $value)
    {
        $this->allowOverflowMidnight = $value;
        return $this->withMeta(['allowOverflowMidnight' => $value]);
    }

    public function useTextInputs(bool $value)
    {
        return $this->withMeta(['useTextInputs' => $value]);
    }

    public function doctorOptions(array $options)
    {
        return $this->withMeta(['doctorOptions' => $this->normalizeDoctorOptions($options)]);
    }

    private function normalizeValueForValidation(array $value): array
    {
        foreach ($this->weekDays() as $day) {
            if (array_key_exists($day, $value)) {
                $value[$day] = $this->extractIntervalsForValidation((array)$value[$day]);
            }
        }

        if (array_key_exists('exceptions', $value) && is_array($value['exceptions'])) {
            foreach ($value['exceptions'] as $date => $intervals) {
                $value['exceptions'][$date] = $this->extractIntervalsForValidation((array)$intervals);
            }
        }

        return $value;
    }

    private function extractIntervalsForValidation(array $intervals): array
    {
        $normalized = [];

        foreach ($intervals as $interval) {
            if (is_string($interval)) {
                $normalized[] = $interval;
                continue;
            }

            if (is_array($interval) && array_key_exists('time', $interval) && is_string($interval['time'])) {
                $normalized[] = $interval['time'];
            }
        }

        return $normalized;
    }

    private function weekDays(): array
    {
        return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    }

    private function normalizeDoctorOptions(array $options): array
    {
        $normalized = [];

        foreach ($options as $key => $option) {
            if (is_array($option)) {
                if (array_key_exists('value', $option) && array_key_exists('label', $option)) {
                    $normalized[] = [
                        'value' => $option['value'],
                        'label' => $option['label'],
                    ];
                    continue;
                }

                if (array_key_exists('id', $option) && array_key_exists('name', $option)) {
                    $normalized[] = [
                        'value' => $option['id'],
                        'label' => $option['name'],
                    ];
                }

                continue;
            }

            $normalized[] = [
                'value' => $key,
                'label' => $option,
            ];
        }

        return $normalized;
    }

//    public function allowMergeOverlapping(bool $allowMergeOverlapping)
//    {
//        $this->allowMergeOverlapping = $allowMergeOverlapping;
//        return $this->withMeta(['allowMergeOverlapping' => $this->allowMergeOverlapping]);
//    }
}
