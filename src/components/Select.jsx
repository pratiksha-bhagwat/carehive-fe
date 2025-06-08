import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)(({ theme, fullWidth, color = 'primary' }) => ({
  minWidth: 200,
  width: fullWidth ? '100%' : 'auto',
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    '&.Mui-focused fieldset': {
      borderColor: theme.palette[color]?.main || theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette[color]?.light || theme.palette.primary.light,
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: theme.palette[color]?.main || theme.palette.primary.main,
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.error.main,
  },
}));

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error = null,
  helperText,
  fullWidth = true,
  margin = 'normal',
  size = 'medium',
  color = 'primary',
  required = false,
  disabled = false,
  startIcon = null,
  ...otherProps
}) => {

  return (
    <StyledFormControl
      fullWidth={fullWidth}
      margin={margin}
      size={size}
      error={!!error}
      color={error ? 'error' : color}
      disabled={disabled}
    >
      <InputLabel id={`${name}-label`} required={required}>
        {label}
      </InputLabel>
      <MuiSelect
        labelId={`${name}-label`}
        id={name}
        name={name}
        value={value}
        label={label}
        onChange={onChange}
        startAdornment={
          startIcon && (
            <InputAdornment position="start">
              {startIcon}
            </InputAdornment>
          )
        }
        {...otherProps}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </StyledFormControl>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  error: PropTypes.bool,
  helperText: PropTypes.string,
  fullWidth: PropTypes.bool,
  margin: PropTypes.oneOf(['none', 'dense', 'normal']),
  size: PropTypes.oneOf(['small', 'medium']),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'error',
    'success',
    'info',
    'warning',
  ]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  startIcon: PropTypes.node,
};

Select.defaultProps = {
  fullWidth: true,
  margin: 'normal',
  size: 'medium',
  required: false,
  disabled: false,
  variant: 'outlined',
  options: [],
};

export default Select;
