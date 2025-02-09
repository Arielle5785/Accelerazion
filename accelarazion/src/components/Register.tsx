import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../auth/useAuth";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form fields
  const [formData, setFormData] = useState({
    firstName: "AAAA",
    lastName: "BBBB",
    gender: "female",
    email: "test  @gmail.com",
    currentCountry: "73",
    phoneCode: "73",
    phoneNumber: "1234567890",
    currentJobTitle: "COO",
    currentCompany: "TTTT",
    linkedinProfile: "rtyqer.com",
    githubProfile: "qwsedrtgyh.com",
    commitAlyah: true,
    dob: "1998-05-31",
    israelJob: "COO",
    password: "1234567",
    userType: "1", // Dropdown for Mentee, Mentor, etc.
    languages: [
      { language: "45", level: "1" },
      { language: "36", level: "2" },
      { language: "57", level: "3" },
    ],
  });

  
                   
  const [countries, setCountries] = useState<{ id: string | number; country_name: string; phone_code: string }[]>([]);
  const [languages, setLanguages] = useState<{ id: string | number; language_name: string }[]>([]);
  const [languageLevels, setLanguageLevels] = useState<{ id: string | number; level: string }[]>([]);
  const [userTypes, setUserTypes] = useState<{ id: string | number; type: string }[]>([]);
  const [error, setError] = useState<string>("");
  // const [countries, setCountries] = useState<(string | number)[]>([]);
  // const [languages, setLanguages] = useState<(string | number)[]>([]);
  // const [languageLevels, setLanguageLevels] = useState<(string | number)[]>([]);
  // const [userTypes, setUserTypes] = useState<string[]>([]);
  

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

  const handleLanguageChange = (index: number,field: string,value: string) => {
    if (value === "-1") return
    setFormData((prevFormData) => {
      // Create a copy of the languages array
      const updatedLanguages = [...prevFormData.languages];
      // Update the specific language object at the given index
      updatedLanguages[index] = {
        ...updatedLanguages[index],
        [field]: value,
      };
      // Return the new form data with updated languages
      // console.log(updatedLanguages);

      return {
        ...prevFormData,
        languages: updatedLanguages,
      };
    });
  };
  //
  // Submit form
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      const responseRegister = await axios.post(
        `${apiBaseUrl}/api/register`,
        formData,
        {
          withCredentials: true,
        }
      );
      const { user } = responseRegister.data;
      // console.log("responseRegister", user);
      if (user) {
        try {
          const responseLogin = await axios.post(
            `${apiBaseUrl}/api/login`,
            { email: formData.email, password: formData.password },
            {
              withCredentials: true,
            }
          );
          // console.log('responseLogin.data',responseLogin.data);
          const { token, user } = responseLogin.data;
          // const { token, user: loggedInUser } = responseLogin.data;

          // console.log("token", token);

          if (token) {
            login(user, token);
            // login(loggedInUser, token);
            navigate(`/register/skills`);
          }
        } catch (err: any) {
          console.log("Something went wrong!");
        }
      }
    } catch (err: any) {
      //     setError(err.response?.data?.message || "Registration failed");
      //     throw err;
      //     }
      // };
      if (err.response?.data?.message?.includes("email already exists")) {
        setError("Email already exists. Redirecting to skills page.");
        navigate(`/register/skills?email=${formData.email}`);
      } else {
        setError(err.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className='register-container'>
      {/* Logo at the Top */}
      {/* <div className='logo-container'>
        <img src={logo} alt='Accelerazion Logo' className='logo' />
      </div> */}

      {/* Form */}
      {/* <div className="auth-form-container"> */}
      <h2 className='form-title'>Register</h2>
      <form className='form-grid' onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='firstName' className='form-label'>
              First Name
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              className='form-input'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='lastName' className='form-label'>
              Last Name
            </label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              className='form-input'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='gender' className='form-label'>
              Gender
            </label>
            <select
              id='gender'
              name='gender'
              value={formData.gender}
              onChange={handleChange}
              className='form-select'
            >
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </select>
          </div>
        </div>
        {/* Contact Info */}
        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='form-input'
              required
            />
          </div>

          {/* User Type */}
          {/* <div className="form-row"> */}
          <div className='form-group'>
            <label htmlFor='userType' className='form-label'>
              User Type
            </label>
            <select
              id='userType'
              name='userType'
              value={formData.userType}
              onChange={handleChange}
              className='form-select'
              required
            >
              <option value=''>Select Type</option>
              {Array.isArray(userTypes) &&
                userTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type}
                  </option>
                ))}
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='dob' className='form-label'>
              Date of Birth
            </label>
            <input
              type='date'
              id='dob'
              name='dob'
              value={formData.dob}
              onChange={handleChange}
              className='form-input'
              required
            />
          </div>
        </div>
        {/* </div> */}
        {/* Contact Info */}
        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='currentCountry' className='form-label'>
              Current Country
            </label>
            <select
              id='currentCountry'
              name='currentCountry'
              value={formData.currentCountry}
              onChange={handleChange}
              className='form-select'
            >
              {Array.isArray(countries) &&
                countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.country_name}
                  </option>
                ))}
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='phoneCode' className='form-label'>
              Phone Code
            </label>
            <select
              id='phoneCode'
              name='phoneCode'
              value={formData.phoneCode}
              onChange={handleChange}
              className='form-select'
            >
              {Array.isArray(countries) &&
                countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.phone_code}
                  </option>
                ))}
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='phoneNumber' className='form-label'>
              Phone Number
            </label>
            <input
              type='text'
              id='phoneNumber'
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={handleChange}
              className='form-input'
              required
            />
          </div>
        </div>

        {/* Job Information */}
        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='currentJobTitle' className='form-label'>
              Current Job Title
            </label>
            <input
              type='text'
              id='currentJobTitle'
              name='currentJobTitle'
              value={formData.currentJobTitle}
              onChange={handleChange}
              className='form-input'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='currentCompany' className='form-label'>
              Current Company
            </label>
            <input
              type='text'
              id='currentCompany'
              name='currentCompany'
              value={formData.currentCompany}
              onChange={handleChange}
              className='form-input'
              required
            />
          </div>
        </div>

        {/* Social Profiles */}
        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='linkedinProfile' className='form-label'>
              LinkedIn Profile
            </label>
            <input
              type='text'
              id='linkedinProfile'
              name='linkedinProfile'
              value={formData.linkedinProfile}
              onChange={handleChange}
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='githubProfile' className='form-label'>
              GitHub Profile
            </label>
            <input
              type='text'
              id='githubProfile'
              name='githubProfile'
              value={formData.githubProfile}
              onChange={handleChange}
              className='form-input'
            />
          </div>
        </div>

        {/* Commitment */}
        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='commitAlyah' className='form-label'>
              Commit to Alyah
            </label>
            <input
              type='checkbox'
              id='commitAlyah'
              name='commitAlyah'
              checked={formData.commitAlyah}
              onChange={handleChange}
              className='form-checkbox'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='israelJob' className='form-label'>
              Looking for a job in Israel
            </label>
            <input
              type='text'
              id='israelJob'
              name='israelJob'
              value={formData.israelJob}
              onChange={handleChange}
              className='form-input'
            />
          </div>

          {/* Password */}
          <div className='form-group'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='form-input'
              required
            />
          </div>
        </div>
        {/* Languages */}
        <div className='form-row'>
          {formData.languages.map((lang, index) => (
            <div key={index} className='language-group'>
              <div className='form-group'>
                <label htmlFor={`language-${index}`} className='form-label'>
                  Language
                </label>
                <select
                  id={`language-${index}`}
                  value={lang.language}
                  onChange={(e) =>
                    handleLanguageChange(index, "language", e.target.value)
                  }
                  className='form-select'
                >
                  <option value=''>Select Language</option>
                  {languages.map((language) => (
                    <option key={language.id} value={language.id}>
                      {language.language_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form-group'>
                <label htmlFor={`level-${index}`} className='form-label'>
                  Level
                </label>
                <select
                  id={`level-${index}`}
                  value={lang.level}
                  onChange={(e) =>
                    handleLanguageChange(index, "level", e.target.value)
                  }
                  className='form-select'
                >
                  <option value=''>Select Level</option>
                  {languageLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        <div>
          <button type='button' onClick={addLanguage}>
            + Add Language
          </button>
          <button type='submit'>Save and Add Skills</button>
          {error && <div className='error-message'>{error}</div>}
        </div>
      </form>
    </div>
  );
};

export default Register;
