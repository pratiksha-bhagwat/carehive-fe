import { FormControlLabel, Checkbox as MuiCheckbox, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';

const Checkbox = ({
  checked = false,
  onChange = () => {},
  label = '',
  name = '',
  disabled = false,
  color = 'primary',
  indeterminate = false,
  sx = {},
  className = '',
  labelProps = {},
  required = false,
  value,
  ...props
}) => {
  const handleChange = (event) => {
    // If the onChange prop is from Formik, it will handle the event correctly
    if (onChange) {
      const syntheticEvent = {
        ...event,
        target: {
          ...event.target,
          name,
          value: event.target.checked,
          type: 'checkbox',
        },
      };
      onChange(syntheticEvent);
    }
  };

  // Determine if the checkbox is checked
  const isChecked = checked || (value !== undefined ? value : false);

  return (
    <Box className={className} sx={sx}>
      <FormControlLabel
        control={
          <MuiCheckbox
            checked={isChecked}
            onChange={handleChange}
            name={name}
            disabled={disabled}
            color={color}
            indeterminate={indeterminate}
            value={isChecked}
            {...props}
          />
        }
        label={
          <Typography
            variant="body2"
            color={disabled ? 'text.disabled' : 'text.primary'}
            {...labelProps}
          >
            {label}
            {required && (
              <Box component="span" sx={{ color: 'error.main' }}>
                {' '}*
              </Box>
            )}
          </Typography>
        }
        sx={{
          margin: 0,
          '& .MuiFormControlLabel-label': {
            marginLeft: 1,
          },
        }}
      />
    </Box>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  name: PropTypes.string,
  disabled: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'info', 'success', 'warning', 'default']),
  indeterminate: PropTypes.bool,
  sx: PropTypes.object,
  className: PropTypes.string,
  labelProps: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.bool,
};

export default Checkbox;
