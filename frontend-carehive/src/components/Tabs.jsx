import PropTypes from 'prop-types';
import { Tabs as MuiTabs, Tab, Box, useTheme } from '@mui/material';

const CustomTabs = ({ 
    tabs, 
    activeTab, 
    onTabChange, 
    variant = 'standard',
    scrollButtons = 'auto',
    allowScrollButtonsMobile = false,
    textColor = 'primary',
    indicatorColor = 'primary',
    centered = false,
    sx = {}
}) => {
    const theme = useTheme();

    const handleChange = (event, newValue) => {
        onTabChange(newValue);
    };

    return (
        <Box sx={{ 
            width: '100%',
            bgcolor: 'background.paper',
            ...sx 
        }}>
            <MuiTabs
                value={activeTab}
                onChange={handleChange}
                variant={variant}
                scrollButtons={scrollButtons}
                allowScrollButtonsMobile={allowScrollButtonsMobile}
                textColor={textColor}
                indicatorColor={indicatorColor}
                centered={centered}
                aria-label="tabs"
            >
                {tabs.map((tab) => (
                    <Tab 
                        key={tab.value} 
                        label={tab.label} 
                        value={tab.value} 
                        icon={tab.icon}
                        iconPosition={tab.iconPosition || 'start'}
                        disabled={tab.disabled}
                        sx={{
                            minHeight: 48,
                            '&.Mui-selected': {
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                            },
                        }}
                    />
                ))}
            </MuiTabs>
        </Box>
    );
};

CustomTabs.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.node.isRequired,
            icon: PropTypes.node,
            iconPosition: PropTypes.oneOf(['top', 'start', 'end', 'bottom']),
            disabled: PropTypes.bool,
        })
    ).isRequired,
    activeTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onTabChange: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(['standard', 'scrollable', 'fullWidth']),
    scrollButtons: PropTypes.oneOf(['auto', true, false]),
    allowScrollButtonsMobile: PropTypes.bool,
    textColor: PropTypes.oneOf(['primary', 'secondary', 'inherit']),
    indicatorColor: PropTypes.oneOf(['primary', 'secondary']),
    centered: PropTypes.bool,
    sx: PropTypes.object,
};

export default CustomTabs;