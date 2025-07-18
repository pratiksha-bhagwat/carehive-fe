import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  TextField as MuiTextField, 
  InputAdornment, 
  IconButton,
} from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(MuiTextField)(({ theme, error }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    '&:hover fieldset': {
      borderColor: error ? theme.palette.error.main : theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
    },
  },
  '& .MuiFormLabel-root': {
    '&.Mui-focused': {
      color: error ? theme.palette.error.main : theme.palette.primary.main,
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginRight: 0,
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}));

const TextField = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    label,
    name,
    value,
    onChange,
    error,
    helperText,
    type = 'text',
    fullWidth = true,
    variant = 'outlined',
    margin = 'normal',
    size = 'medium',
    required = false,
    disabled = false,
    multiline = false,
    rows,
    maxRows,
    placeholder,
    startIcon,
    InputProps,
    InputLabelProps,
    FormHelperTextProps,
    ...otherProps
  } = props;

  const isPasswordField = type === 'password';
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <StyledTextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={inputType}
      variant={variant}
      fullWidth={fullWidth}
      margin={margin}
      error={!!error}
      helperText={error || helperText}
      startIcon={startIcon}
      size={size}
      required={required}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      maxRows={maxRows}
      placeholder={placeholder}
      InputProps={{
        ...InputProps,
        startAdornment: startIcon ? (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ) : null,
        endAdornment: isPasswordField ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
              sx={{ mr: 0.5 }}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ) : InputProps?.endAdornment,
      }}
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps,
      }}
      FormHelperTextProps={{
        component: 'div',
        ...FormHelperTextProps,
      }}
      {...otherProps}
    />
  );
};

TextField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  type: PropTypes.string,
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  margin: PropTypes.oneOf(['none', 'dense', 'normal']),
  size: PropTypes.oneOf(['small', 'medium']),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  maxRows: PropTypes.number,
  placeholder: PropTypes.string,
  startIcon: PropTypes.node,
  InputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
  FormHelperTextProps: PropTypes.object,
};

export default TextField;