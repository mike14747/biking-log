'use client';

import { FormEvent, ChangeEvent, useRef, useState } from 'react';
import FormInput from '../FormInput';
import Button from '../Button';

type RideData = {
    date: string;
    distance: string;
    time_duration: string;
    avg_speed: string;
    temperature: string;
    wind_speed: string;
    wind_dir: string;
    location: string;
    notes: string;
}

export default function AddRideData() {
    const state = useRef<RideData>({
        date: '',
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
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

    const handleDataSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const id = 4;

        const res = await fetch('/api/users/' + id + '/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(state.current),
        }).catch(error => {
            console.error(error.name + ': ' + error.message);
            setError('An error occurred sending the data.');
        });

        if (res) {
            if (res.status === 201) {
                setIsSuccessful(true);
                setError('');
            }

            if (res.status !== 201) {
                setIsSuccessful(false);

                res.status === 400 && setError('An error occurred. One or more of the fields are missing or not in the proper format.');
                res.status === 409 && setError('An error occurred. The username you submitted is already in use.');
                res.status === 500 && setError('A server error occurred. Please try your submission again.');
            }
        }
    };

    return (
        <>
            {error &&
                <p className="error">
                    {error}
                </p>
            }

            {isSuccessful &&
                <p className="success-large">You have successfully registered!</p>
            }

            <h3>
                Add ride data
            </h3>

            <form onSubmit={handleDataSubmit} className="form">
                <FormInput
                    id="date"
                    label="Date"
                    name="date"
                    type="text"
                    required={true}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.date = e.target.value}
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
                    required={true}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.time_duration = e.target.value}
                />

                <FormInput
                    id="avg_speed"
                    label="Avg Speed"
                    name="avg_speed"
                    type="text"
                    required={true}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.avg_speed = e.target.value}
                />

                <FormInput
                    id="temperature"
                    label="Temperature"
                    name="temperature"
                    type="text"
                    required={true}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.temperature = e.target.value}
                />

                <FormInput
                    id="wind_speed"
                    label="Wind Speed"
                    name="wind_speed"
                    type="text"
                    required={true}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.wind_speed = e.target.value}
                />

                <FormInput
                    id="wind_dir"
                    label="Wind Direction"
                    name="wind_dir"
                    type="text"
                    required={true}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.wind_dir = e.target.value}
                />

                <FormInput
                    id="location"
                    label="Location"
                    name="location"
                    type="text"
                    required={true}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.location = e.target.value}
                />

                <FormInput
                    id="notes"
                    label="Notes"
                    name="notes"
                    type="text"
                    required={true}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => state.current.notes = e.target.value}
                />

                <div className="btn-container">
                    <Button type="submit" size="medium" variant="contained">Submit</Button>
                </div>
            </form>
        </>
    );
}
