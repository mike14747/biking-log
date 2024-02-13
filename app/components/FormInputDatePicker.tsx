import { useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styles from '@/styles/FormInput.module.css';

type FormInputProps = {
    id: string;
    label?: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange: (date: Date | null) => void;
    errorMsg?: string;
    required?: boolean;
    size?: 'small' | 'normal';
    placeholder?: string;
    pattern?: string;
    value?: string;
    readOnly?: boolean;
    disabled?: boolean;
    dateFormat?: string;
    date?: Date;
}

const sizes = ['small', 'normal'];

export default function FormInputDatePicker({ id, label = '', name, handleChange, errorMsg = '', required = false, size = 'normal', dateFormat = 'yyyy-MM-dd', date }: FormInputProps) {
    const inputSize = sizes?.includes(size) ? size : 'normal';

    const [selectedDate, setSelectedDate] = useState<Date | null>(date || null);

    const handleDateChange = (date: Date | null) => {
        const newDate = date;

        setSelectedDate(() => {
            handleChange(newDate);
            return newDate;
        });
    };

    return (
        <div className={styles.inputWrapper}>
            {/* I need to keep the DatePicker component outside the label element or else it doesn't properly collapse when a date is picked */}
            <label htmlFor={id} className={`${styles.label} ${styles[inputSize]}`}>
                {label}

                {/* you can comment out the following line if you don't want to notify the user of fields that are required */}
                {required && <span className={styles.required}>*required</span>}
            </label>

            <DatePicker
                id={id}
                name={name}
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat={dateFormat}
                className={`${styles.input} ${styles[inputSize]}`}
            />

            {errorMsg &&
                <p className={styles.errorMessage}>{errorMsg}</p>
            }
        </div>
    );
}
