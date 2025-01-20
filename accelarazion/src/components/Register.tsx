import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";

const Register: React.FC = () => {
  const navigate = useNavigate();

  // Form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    email: "",
    currentCountry: "",
    phoneCode: "",
    phoneNumber: "",
    currentJobTitle: "",
    currentCompany: "",
    linkedinProfile: "",
    githubProfile: "",
    commitAlyah: false,
    dob: "",
    israelJob: "",
    password: "",
    userType: "", // Dropdown for Mentee, Mentor, etc.
    languages: [{ language: "", level: "" }],
  });

  const [countries, setCountries] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [languageLevels, setLanguageLevels] = useState<any[]>([]);
  const [userTypes, setUserTypes] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      const countriesResponse = await axios.get(`${apiBaseUrl}/api/countries`);
      const languagesResponse = await axios.get(`${apiBaseUrl}/api/languages`);
      const levelsResponse = await axios.get(`${apiBaseUrl}/api/languages-level`);
      const typesResponse = await axios.get(`${apiBaseUrl}/api/type-users`);

      setCountries(countriesResponse.data);
      setLanguages(languagesResponse.data);
      setLanguageLevels(levelsResponse.data);
      setUserTypes(typesResponse.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Add a new language entry
  const addLanguage = () => {
    setFormData({
      ...formData,
      languages: [...formData.languages, { language: "", level: "" }],
    });
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newValue =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  // Handle nested language changes
  const handleLanguageChange = (index: number, field: string, value: string) => {
    const updatedLanguages = formData.languages.map((lang, i) =>
      i === index ? { ...lang, [field]: value } : lang
    );
    setFormData({ ...formData, languages: updatedLanguages });
  };

  // Submit form
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${apiBaseUrl}/api/register`, formData, {
      withCredentials: true,
    });
    const userId = response.data.user.id; // Assuming backend returns user.id
    return userId;
    } catch (err: any) {
    setError(err.response?.data?.message || "Registration failed");
    throw err;
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="form-group">
          <label>First Name</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        {/* User Type */}
        <div className="form-group">
          <label>User Type</label>
          <select name="userType" value={formData.userType} onChange={handleChange} required>
            <option value="">Select Type</option>
            {Array.isArray(userTypes) &&
              userTypes.map((type) => (
                <option key={type.id} value={type.type}>
                  {type.type}
                </option>
              ))}
          </select>
        </div>

        {/* Contact Info */}
        <div className="form-group">
          <label>Current Country</label>
          <select name="currentCountry" value={formData.currentCountry} onChange={handleChange}>
            {Array.isArray(countries) &&
              countries.map((country) => (
                <option key={country.id} value={country.country_name}>
                  {country.country_name}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label>Phone Code</label>
          <select name="phoneCode" value={formData.phoneCode} onChange={handleChange}>
            {Array.isArray(countries) &&
              countries.map((country) => (
                <option key={country.id} value={country.phone_code}>
                  {country.phone_code}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </div>

        {/* Job Information */}
        <div className="form-group">
          <label>Current Job Title</label>
          <input
            name="currentJobTitle"
            value={formData.currentJobTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Current Company</label>
          <input
            name="currentCompany"
            value={formData.currentCompany}
            onChange={handleChange}
            required
          />
        </div>

        {/* Social Profiles */}
        <div className="form-group">
          <label>LinkedIn Profile</label>
          <input name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>GitHub Profile</label>
          <input name="githubProfile" value={formData.githubProfile} onChange={handleChange} />
        </div>

        {/* Commitment */}
        <div className="form-group">
          <label>Commit to Alyah</label>
          <input
            type="checkbox"
            name="commitAlyah"
            checked={formData.commitAlyah}
            onChange={handleChange}
          />
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        </div>

        {/* Looking for Job */}
        <div className="form-group">
          <label>Looking for a job in Israel</label>
          <input name="israelJob" value={formData.israelJob} onChange={handleChange} />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        {/* Languages */}
        {formData.languages.map((lang, index) => (
          <div key={index} className="form-group">
            <label>Language</label>
            <select
              value={lang.language}
              onChange={(e) => handleLanguageChange(index, "language", e.target.value)}
            >
              {Array.isArray(languages) &&
                languages.map((language) => (
                  <option key={language.id} value={language.language_name}>
                    {language.language_name}
                  </option>
                ))}
            </select>
            <label>Level</label>
            <select
              value={lang.level}
              onChange={(e) => handleLanguageChange(index, "level", e.target.value)}
            >
              {Array.isArray(languageLevels) &&
                languageLevels.map((level) => (
                  <option key={level.id} value={level.level}>
                    {level.level}
                  </option>
                ))}
            </select>
          </div>
        ))}
        <button type="button" onClick={addLanguage}>
          + Add Language
        </button>

        {/* Buttons */}
       <div className="form-actions">
        <button type="submit">Save</button>
        <button
            type="button"
            onClick={async (e) => {
            e.preventDefault();
            try {
                const response = await handleSubmit(e); // Save form data and get userId
                // if (response) {
                navigate(`/register/skills?userId=${response}`); // Redirect to skills page
                // }
            } catch (error) {
                console.error("Error navigating to Add Skills:", error);
            }
            }}
        >
            Add Skills
            </button>
        </div>  
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Register;
