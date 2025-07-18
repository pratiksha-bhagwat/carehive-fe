import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';

const StyledButton = styled(LoadingButton)(({ theme, fullWidth, variant, size }) => ({
  borderRadius: '16px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  padding: theme.spacing(1.5, 3),
  ...(size === 'small' && {
    padding: theme.spacing(0.75, 2),
    fontSize: '0.875rem',
  }),
  ...(size === 'large' && {
    padding: theme.spacing(1.5, 4),
    fontSize: '1.1rem',
  }),
  ...(variant === 'contained' && {
    '&:hover': {
      boxShadow: 'none',
    },
  }),
  ...(variant === 'outlined' && {
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
    },
  }),
  ...(fullWidth && {
    width: '100%',
  }),
}));

const Button = ({
  children,
  label,
  isLoading = false,
  loadingPosition = 'center',
  loadingIndicator = 'Loading...',
  startIcon,
  endIcon,
  fullWidth = false,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const buttonContent = label || children;
  
  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || isLoading}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      loading={isLoading}
      loadingPosition={loadingPosition}
      loadingIndicator={loadingIndicator}
      startIcon={!isLoading ? startIcon : null}
      endIcon={!isLoading ? endIcon : null}
      {...props}
    >
      {buttonContent}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isLoading: PropTypes.bool,
  loadingPosition: PropTypes.oneOf(['start', 'end', 'center']),
  loadingIndicator: PropTypes.node,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'error',
    'warning',
    'info',
    'success',
    'inherit',
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;
