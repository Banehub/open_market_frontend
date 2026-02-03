import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { updateUser, changePassword } from '../../api'
import styles from './index.module.css'

function Settings() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
      })
    }
  }, [user])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileMessage('')
    if (!user?.id) return
    try {
      await updateUser(user.id, {
        username: profileData.username,
        email: profileData.email,
        bio: profileData.bio,
      })
      setProfileMessage('Profile updated. You may need to log in again to see changes.')
    } catch (err) {
      setProfileError(err.data?.message || err.message || 'Update failed')
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordMessage('')
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    if (!user?.id) return
    try {
      await changePassword(user.id, passwordData.currentPassword, passwordData.newPassword)
      setPasswordMessage('Password updated.')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPasswordError(err.data?.message || err.message || 'Password update failed')
    }
  }

  if (!user) return null

  return (
    <div className={styles.settings}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Settings</h1>
          <div className={styles.sections}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Profile Settings</h2>
              <form onSubmit={handleProfileSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="username" className={styles.label}>Username</label>
                  <input
                    id="username"
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="bio" className={styles.label}>Bio</label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className={styles.textarea}
                    rows="4"
                  />
                </div>
                {profileMessage && <p className={styles.message}>{profileMessage}</p>}
                {profileError && <p className={styles.error}>{profileError}</p>}
                <button type="submit" className={styles.button}>
                  Save Changes
                </button>
              </form>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="currentPassword" className={styles.label}>Current Password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="newPassword" className={styles.label}>New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
                {passwordMessage && <p className={styles.message}>{passwordMessage}</p>}
                {passwordError && <p className={styles.error}>{passwordError}</p>}
                <button type="submit" className={styles.button}>
                  Update Password
                </button>
              </form>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Subscription Management</h2>
              <div className={styles.subscriptionCard}>
                <h3 className={styles.subscriptionTitle}>Verified Seller Plan</h3>
                <p className={styles.subscriptionStatus}>{user.verified ? 'Active' : 'Inactive'}</p>
                <p className={styles.subscriptionPrice}>R15/month</p>
                <button type="button" className={styles.button}>Manage Subscription</button>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Settings
