import { ChangeEventHandler, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styles from '@/styles/FormInput.module.css';

type FormInputProps = {
    id: string;
    label?: string;
    name: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    errorMsg?: string;
    required?: boolean;
    size?: 'small' | 'normal';
    placeholder?: string;
    pattern?: string;
    value?: string;
    readOnly?: boolean;
    disabled?: boolean;
}

const sizes = ['small', 'normal'];

export default function FormInputDatePicker({ id, label = '', name, handleChange, errorMsg = '', required = false, size = 'normal' }: FormInputProps) {
    const inputSize = sizes?.includes(size) ? size : 'normal';

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    return (
        <div className={styles.inputWrapper}>
            <label htmlFor={id} className={`${styles.label} ${styles[inputSize]}`}>
                {label}

                {/* you can comment out the following line if you don't want to notify the user of fields that are required */}
                {required && <span className={styles.required}>*required</span>}

                <DatePicker
                    id={id}
                    name={name}
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    required={required}
                    className={`${styles.input} ${styles[inputSize]}`}
                />
            </label>

            {errorMsg &&
                <p className={styles.errorMessage}>{errorMsg}</p>
            }
        </div>
    );
}
