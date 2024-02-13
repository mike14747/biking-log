'use client';

import { FormEvent, ChangeEvent, useRef, useState } from 'react';
import FormInput from '@/components/FormInput';
import FormInputDatePicker from '@/components/FormInputDatePicker';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import { StatusCodeObj } from '@/types/misc-types';
import { datePattern, dateErrorMsg } from '@/lib/formInputPatterns';

type RideData = {
    date: Date | null;
    distance: string;
    time_duration: string;
    avg_speed: string;
    temperature: string;
    wind_speed: string;
    wind_dir: string;
    location: string;
    notes: string;
}

const statusCodeErrorMessages: StatusCodeObj = {
    400: 'An error occurred. Some field(s) is/are not in the proper format.',
    401: 'An error occurred. You do not have permission to perform this action.',
    404: 'This form is currently disabled.',
    500: 'A server error occurred. Please try your update again.',
};

export default function AddRideForm() {
    const state = useRef<RideData>({
        date: null,
        distance: '',
        time_duration: '',
        avg_speed: '',
        temperature: '',
        wind_speed: '',
        wind_dir: '',
        location: '',
        notes: '',
    });

    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

    const handleDataSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);

        console.log(state.current);

        // const res = await fetch('/api/data', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json;charset=utf-8',
        //     },
        //     body: JSON.stringify(state.current),
        // }).catch(error => {
        //     console.error(error.name + ': ' + error.message);
        //     setError('An error occurred sending the data.');
        // });

        const res = {
            status: 404,
        };

        setIsSubmitting(false);

        if (!res) setError(statusCodeErrorMessages[500]);

        if (res?.status === 201) {
            setIsSuccessful(true);
            setError('');
        }

        if (res && res.status !== 201) setError(statusCodeErrorMessages[res.status] || 'An unknown error occurred');
    };

    return (
        <>
            {error &&
                <p className="error">
                    {error}
                </p>
            }

            {isSubmitting &&
                <Spinner size="large" />
            }

            {isSuccessful &&
                <p className="success-large">You have successfully added the ride data!</p>
            }

            <form onSubmit={handleDataSubmit} className="form">
                <FormInputDatePicker
                    id="date"
                    label="Date"
                    name="date"
                    dateFormat="yyyy-MM-dd"
                    required={true}
                    handleChange={(date: Date | null) => state.current.date = date}
                    pattern={datePattern}
                    errorMsg={dateErrorMsg}
                    date={new Date()}
                />

                <FormInput
                    id="distance"
                    label="Distance"
                    name="distance"
                    type="text"
                    required={true}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.distance = e.target.value}
                />

                <FormInput
                    id="time_duration"
                    label="Time Duration"
                    name="time_duration"
                    type="text"
                    required={false}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.time_duration = e.target.value}
                />

                <FormInput
                    id="avg_speed"
                    label="Avg Speed"
                    name="avg_speed"
                    type="text"
                    required={false}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.avg_speed = e.target.value}
                />

                <FormInput
                    id="temperature"
                    label="Temperature"
                    name="temperature"
                    type="text"
                    required={false}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.temperature = e.target.value}
                />

                <FormInput
                    id="wind_speed"
                    label="Wind Speed"
                    name="wind_speed"
                    type="text"
                    required={false}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.wind_speed = e.target.value}
                />

                <FormInput
                    id="wind_dir"
                    label="Wind Direction"
                    name="wind_dir"
                    type="text"
                    required={false}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.wind_dir = e.target.value}
                />

                <FormInput
                    id="location"
                    label="Location"
                    name="location"
                    type="text"
                    required={false}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.location = e.target.value}
                />

                <FormInput
                    id="notes"
                    label="Notes"
                    name="notes"
                    type="text"
                    required={false}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.notes = e.target.value}
                />

                <div className="btn-container">
                    <Button type="submit" size="medium" variant="contained">Submit</Button>
                </div>
            </form>
        </>
    );
}
