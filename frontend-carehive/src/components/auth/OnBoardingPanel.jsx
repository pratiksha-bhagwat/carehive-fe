import PropTypes from 'prop-types';
import { FiHeart, FiShield, FiUsers, FiClock } from 'react-icons/fi';
import icon from '../../assets/carehive.png';

const features = [
  {
    icon: <FiHeart className="h-6 w-6 text-white" />,
    title: 'Personalized Care',
    description: 'Tailored healthcare solutions for your unique needs and preferences.'
  },
  {
    icon: <FiShield className="h-6 w-6 text-white" />,
    title: 'Trusted Professionals',
    description: 'Connect with verified and experienced healthcare providers.'
  },
  {
    icon: <FiUsers className="h-6 w-6 text-white" />,
    title: 'Family Management',
    description: 'Easily manage healthcare for your entire family in one place.'
  },
  {
    icon: <FiClock className="h-6 w-6 text-white" />,
    title: '24/7 Support',
    description: 'Round-the-clock assistance whenever you need it.'
  }
];

const OnBoardingPanel = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-blue-400 to-blue-600 p-8 text-white md:w-1/2 ${className}`}>
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-2 flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-200 to-blue-400 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm w-max">
            <img src={icon} alt="Logo" className="h-8 w-8" />
            <span>Welcome to CareHive</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            {title || 'Your Health, Our Priority'}
          </h1>
          <p className="mb-8 text-blue-100">
            {subtitle || 'Join thousands of families who trust us with their healthcare needs.'}
          </p>
          
          <div className="space-y-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start space-x-4">
                <div className="mt-1 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-200 to-blue-400 p-2">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12">
          <div className="mb-4 flex space-x-2">
            <div className="h-1.5 w-8 rounded-full bg-white/40"></div>
            <div className="h-1.5 w-4 rounded-full bg-white/50"></div>
            <div className="h-1.5 w-4 rounded-full bg-white/30"></div>
          </div>
          <blockquote className="border-l-4 border-white/40 pl-4">
            <p className="text-white">
              The best way to care for those who once cared for us.
            </p>
            <footer className="mt-2 text-sm text-white">- CareHive Team</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

OnBoardingPanel.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string
};

OnBoardingPanel.defaultProps = {
  title: 'Your Health, Our Priority',
  subtitle: 'Join thousands of families who trust us with their healthcare needs.',
  className: ''
};

export default OnBoardingPanel;
