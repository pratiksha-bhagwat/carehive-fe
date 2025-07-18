import PropTypes from 'prop-types';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';

const DatePicker = (props) => {
  const {
    label,
    name,
    value,
    onChange,
    error = null,
    helperText,
    fullWidth = true,
    margin = 'normal',
    size = 'medium',
    required = false,
    disabled = false,
    maxDate,
    minDate,
    format = 'DD/MM/YYYY',
    ...otherProps
  } = props;

  const handleDateChange = (newValue) => {
    if (onChange) {
      // Convert the Day.js object to an ISO string before passing it up
      const dateValue = newValue ? newValue.toISOString() : null;
      onChange({
        target: {
          name,
          value: dateValue
        }
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DatePicker',
          'MobileDatePicker',
          'DesktopDatePicker',
          'StaticDatePicker',
        ]}
      >
        <DesktopDatePicker
          label={label}
          value={value ? dayjs(value) : null}  // Convert string to Day.js object for display
          onChange={handleDateChange}
          format={format}
          slotProps={{
            textField: {
              fullWidth,
              margin,
              size,
              required,
              disabled,
              error: !!error,
              helperText: error || helperText,
              onKeyDown: (e) => e.preventDefault(),
              sx: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              },
              ...otherProps,
            },
            popper: {
              placement: 'bottom-start',
              disablePortal: true,
            },
            desktopPaper: {
              sx: {
                mt: 1,
                '& .MuiPickersDay-root': {
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                },
              },
            },
          }}
          maxDate={maxDate ? dayjs(maxDate) : null}
          minDate={minDate ? dayjs(minDate) : null}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any, // Can be Day.js object, Date, or string
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  helperText: PropTypes.string,
  fullWidth: PropTypes.bool,
  margin: PropTypes.oneOf(['none', 'dense', 'normal']),
  size: PropTypes.oneOf(['small', 'medium']),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  maxDate: PropTypes.any,
  minDate: PropTypes.any,
  format: PropTypes.string,
};

DatePicker.defaultProps = {
  fullWidth: true,
  margin: 'normal',
  size: 'medium',
  required: false,
  disabled: false,
  format: 'DD/MM/YYYY',
};

export default DatePicker;
