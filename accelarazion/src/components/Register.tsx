import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../auth/useAuth";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";

const Register: React.FC = () => {
  const navigate = useNavigate();

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
      { language: "73", level: "1" },
      { language: "36", level: "2" },
      {language:"57",level:"3"}
    ],
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

  const handleLanguageChange = (index: number, field: string, value: string) => {
    if(value === "-1") return
  setFormData((prevFormData) => {
    // Create a copy of the languages array
    const updatedLanguages = [...prevFormData.languages];
    // Update the specific language object at the given index
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value
    };
    // Return the new form data with updated languages
    console.log(updatedLanguages);
    
    return {
      ...prevFormData,
      languages: updatedLanguages
    };
  });
  };
  
  // Submit form
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    
    try {
      const responseRegister = await axios.post(`${apiBaseUrl}/api/register`, formData, {
      withCredentials: true,
      });
      const { user } = responseRegister.data;
      if (user) {
        console.log("user", user);
        
      try {
        const responseLogin = await axios.post(`${apiBaseUrl}/api/login`, { email:formData.email, password:formData.password }, {
        withCredentials: true,
        });
        const { token } = responseLogin.data;
        console.log("token", token);
        
        if(token){
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
                <option key={type.id} value={type.id}>
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
                <option key={country.id} value={country.id}>
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
                <option key={country.id} value={country.id}>
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
        <div>
      {formData.languages.map((lang, index) => (
        <div key={index} className="form-group">
          <label>Language</label>
          <select
            value={lang.language}
            onChange={(e) => handleLanguageChange(index, "language", e.target.value)}
          ><option key={-1} value={-1}></option>
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.language_name}
              </option>
            ))}
          </select>
          
          <label>Level</label>
          <select
            value={lang.level}
            onChange={(e) => handleLanguageChange(index, "level", e.target.value)}
          ><option key={-1} value={-1}></option>
            {languageLevels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.level}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>

        <button type="button" onClick={addLanguage}>
          + Add Language
        </button>

        {/* Buttons */}
       {/* <div className="form-actions"> */}
        {/* <button type="submit">Save</button>
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
            </button> */}
                  {/* </div>   */}
        {/* {error && <div className="error-message">{error}</div>} */}
        <button type="submit">Save and Add Skills</button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Register;
