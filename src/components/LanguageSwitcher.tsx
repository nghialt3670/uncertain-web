import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select
      defaultValue={i18n.language}
      style={{ width: 120 }}
      onChange={handleChange}
    >
      <Option value="en">English</Option>
      <Option value="zh">中文</Option>
      <Option value="vi">Tiếng Việt</Option>
    </Select>
  );
};

export default LanguageSwitcher; 