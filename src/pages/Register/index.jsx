import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navigation from '../../components/Navigation'
import styles from './index.module.css'

function Register() {
  const [registrationType, setRegistrationType] = useState('quick')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [name, setName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [surname, setSurname] = useState('')
  const [age, setAge] = useState('')
  const [area, setArea] = useState('')

  const [cellNumber, setCellNumber] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [passportNumber, setPassportNumber] = useState('')
  const [idType, setIdType] = useState('id')
  const [location, setLocation] = useState('')
  const [idFile, setIdFile] = useState(null)

  const [companyName, setCompanyName] = useState('')
  const [companyNumber, setCompanyNumber] = useState('')
  const [companyContact, setCompanyContact] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const buildBody = () => {
    const base = { email, password, registrationType }
    if (registrationType === 'quick') {
      return {
        ...base,
        name,
        middleName: middleName || undefined,
        surname,
        age: age ? parseInt(age, 10) : undefined,
        area,
      }
    }
    if (registrationType === 'full') {
      return {
        ...base,
        name,
        middleName: middleName || undefined,
        surname,
        age: age ? parseInt(age, 10) : undefined,
        cellNumber,
        idNumber: idType === 'id' ? idNumber : undefined,
        passportNumber: idType === 'passport' ? passportNumber : undefined,
        idType,
        location: location || area,
        area,
        idFile: idFile ? idFile.name : undefined,
        canBecomeVerifiedSeller: true,
      }
    }
    if (registrationType === 'company') {
      return {
        ...base,
        companyName,
        companyNumber,
        companyContact,
        companyAddress,
        companyEmail: companyEmail || email,
        companyWebsite: companyWebsite || undefined,
      }
    }
    return base
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(buildBody())
      navigate('/')
    } catch (err) {
      setError(err.data?.message || err.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.register}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Join OpenMarket today</p>

            <div className={styles.typeSelector}>
              <label className={styles.typeLabel}>Account Type</label>
              <div className={styles.typeOptions}>
                <button
                  type="button"
                  className={`${styles.typeButton} ${registrationType === 'quick' ? styles.active : ''}`}
                  onClick={() => setRegistrationType('quick')}
                >
                  Quick Account
                </button>
                <button
                  type="button"
                  className={`${styles.typeButton} ${registrationType === 'full' ? styles.active : ''}`}
                  onClick={() => setRegistrationType('full')}
                >
                  Trusted Seller
                </button>
                <button
                  type="button"
                  className={`${styles.typeButton} ${registrationType === 'company' ? styles.active : ''}`}
                  onClick={() => setRegistrationType('company')}
                >
                  Company
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email *</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password *</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Create a password"
                  required
                />
              </div>

              {registrationType === 'quick' && (
                <>
                  <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>Name *</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.input}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="middleName" className={styles.label}>Middle Name</label>
                    <input
                      id="middleName"
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className={styles.input}
                      placeholder="Middle name (optional)"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="surname" className={styles.label}>Surname *</label>
                    <input
                      id="surname"
                      type="text"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className={styles.input}
                      placeholder="Last name"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="age" className={styles.label}>Age *</label>
                    <input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className={styles.input}
                      placeholder="Your age"
                      min="18"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="area" className={styles.label}>Area/Location *</label>
                    <input
                      id="area"
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className={styles.input}
                      placeholder="Your area or location"
                      required
                    />
                  </div>
                </>
              )}

              {registrationType === 'full' && (
                <>
                  <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>Name *</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.input}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="middleName" className={styles.label}>Middle Name</label>
                    <input
                      id="middleName"
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className={styles.input}
                      placeholder="Middle name (optional)"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="surname" className={styles.label}>Surname *</label>
                    <input
                      id="surname"
                      type="text"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className={styles.input}
                      placeholder="Last name"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="age" className={styles.label}>Age *</label>
                    <input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className={styles.input}
                      placeholder="Your age"
                      min="18"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="cellNumber" className={styles.label}>Cell Number *</label>
                    <input
                      id="cellNumber"
                      type="tel"
                      value={cellNumber}
                      onChange={(e) => setCellNumber(e.target.value)}
                      className={styles.input}
                      placeholder="+27 12 345 6789"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="idType" className={styles.label}>ID Type *</label>
                    <select
                      id="idType"
                      value={idType}
                      onChange={(e) => setIdType(e.target.value)}
                      className={styles.select}
                      required
                    >
                      <option value="id">ID Number</option>
                      <option value="passport">Passport Number</option>
                    </select>
                  </div>
                  {idType === 'id' ? (
                    <div className={styles.inputGroup}>
                      <label htmlFor="idNumber" className={styles.label}>ID Number *</label>
                      <input
                        id="idNumber"
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className={styles.input}
                        placeholder="13-digit ID number"
                        required
                      />
                    </div>
                  ) : (
                    <div className={styles.inputGroup}>
                      <label htmlFor="passportNumber" className={styles.label}>Passport Number *</label>
                      <input
                        id="passportNumber"
                        type="text"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        className={styles.input}
                        placeholder="Passport number"
                        required
                      />
                    </div>
                  )}
                  <div className={styles.inputGroup}>
                    <label htmlFor="location" className={styles.label}>Area/Location *</label>
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={styles.input}
                      placeholder="Your area or location"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="idFile" className={styles.label}>ID/Passport Upload *</label>
                    <input
                      id="idFile"
                      type="file"
                      onChange={(e) => setIdFile(e.target.files[0])}
                      className={styles.fileInput}
                      accept="image/*,.pdf"
                      required
                    />
                    {idFile && <p className={styles.fileInfo}>Selected: {idFile.name}</p>}
                  </div>
                </>
              )}

              {registrationType === 'company' && (
                <>
                  <div className={styles.inputGroup}>
                    <label htmlFor="companyName" className={styles.label}>Company Name *</label>
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={styles.input}
                      placeholder="Company name"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="companyNumber" className={styles.label}>Company Registration Number *</label>
                    <input
                      id="companyNumber"
                      type="text"
                      value={companyNumber}
                      onChange={(e) => setCompanyNumber(e.target.value)}
                      className={styles.input}
                      placeholder="Company registration number"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="companyContact" className={styles.label}>Contact Number *</label>
                    <input
                      id="companyContact"
                      type="tel"
                      value={companyContact}
                      onChange={(e) => setCompanyContact(e.target.value)}
                      className={styles.input}
                      placeholder="+27 12 345 6789"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="companyAddress" className={styles.label}>Company Address *</label>
                    <textarea
                      id="companyAddress"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      className={styles.textarea}
                      placeholder="Full company address"
                      rows="3"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="companyEmail" className={styles.label}>Company Email</label>
                    <input
                      id="companyEmail"
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className={styles.input}
                      placeholder="company@email.com (optional)"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="companyWebsite" className={styles.label}>Company Website</label>
                    <input
                      id="companyWebsite"
                      type="url"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      className={styles.input}
                      placeholder="https://www.company.com (optional)"
                    />
                  </div>
                </>
              )}

              {error && <div className={styles.error}>{error}</div>}
              <button type="submit" className={styles.button} disabled={submitting}>
                {submitting ? 'Creating account...' : registrationType === 'quick' ? 'Create Quick Account' : registrationType === 'full' ? 'Register as Trusted Seller' : 'Register Company'}
              </button>
            </form>
            <p className={styles.footer}>
              Already have an account? <Link to="/login" className={styles.link}>Login</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Register
