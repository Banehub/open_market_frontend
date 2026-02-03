import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navigation from '../../components/Navigation'
import VerifiedBadge from '../../components/VerifiedBadge'
import Footer from '../../components/Footer'
import styles from './index.module.css'

function GetVerified() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [processing, setProcessing] = useState(false)

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handlePayment = async (method) => {
    setSelectedPayment(method)
    setProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      alert(`Payment via ${method} would be processed here. In production, this would redirect to ${method} payment gateway.`)
      // In real app, redirect to payment gateway
    }, 2000)
  }

  const benefits = [
    {
      icon: 'fa-check-circle',
      title: 'Verified Badge',
      description: 'Display a trusted verified badge on your profile and listings',
    },
    {
      icon: 'fa-shield-halved',
      title: 'Fraud Protection',
      description: 'Help prevent fraud and theft by verifying your identity',
    },
    {
      icon: 'fa-ban',
      title: 'No Ads',
      description: 'Enjoy an ad-free experience while browsing and selling',
    },
    {
      icon: 'fa-star',
      title: 'Increased Trust',
      description: 'Build trust with buyers through verified seller status',
    },
    {
      icon: 'fa-arrow-up',
      title: 'Priority Listing',
      description: 'Get priority placement in search results (Coming Soon)',
    },
    {
      icon: 'fa-building',
      title: 'Business Credibility',
      description: 'Show you\'re a legitimate business or seller',
    },
  ]

  return (
    <div className={styles.getVerified}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <div className={styles.badgePreview}>
              <VerifiedBadge />
            </div>
            <h1 className={styles.heroTitle}>Become a Verified Seller</h1>
            <p className={styles.heroSubtitle}>
              Join trusted sellers and help create a safer marketplace
            </p>
          </div>

          <div className={styles.whySection}>
            <h2 className={styles.sectionTitle}>Why Get Verified?</h2>
            <div className={styles.whyContent}>
              <div className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  <i className="fa-regular fa-shield-halved"></i>
                </div>
                <h3 className={styles.whyTitle}>Stop Fraud & Theft</h3>
                <p className={styles.whyText}>
                  Verification requires full identity information (ID/Passport, contact details, location). 
                  This helps us verify that you are who you say you are, significantly reducing fraud and theft 
                  on our platform. We verify every seller to protect both buyers and legitimate sellers.
                </p>
              </div>
              <div className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  <i className="fa-regular fa-lock"></i>
                </div>
                <h3 className={styles.whyTitle}>Secure Marketplace</h3>
                <p className={styles.whyText}>
                  By requiring complete information from all verified sellers, we create a safer environment 
                  for everyone. Buyers can trust that verified sellers have been properly vetted, and sellers 
                  can operate with confidence knowing their customers are dealing with verified accounts.
                </p>
              </div>
              <div className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  <i className="fa-regular fa-file-lines"></i>
                </div>
                <h3 className={styles.whyTitle}>Full Information Required</h3>
                <p className={styles.whyText}>
                  For individuals: Name, ID/Passport, cell number, location. For companies: Company registration, 
                  contact details, business address. This comprehensive verification process ensures accountability 
                  and helps prevent fraudulent activities.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.benefitsSection}>
            <h2 className={styles.sectionTitle}>Benefits of Verification</h2>
            <div className={styles.benefitsGrid}>
              {benefits.map((benefit, index) => (
                <div key={index} className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>
                    <i className={`fa-regular ${benefit.icon}`}></i>
                  </div>
                  <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                  <p className={styles.benefitDescription}>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.pricingSection}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h2 className={styles.pricingTitle}>Verified Seller Plan</h2>
                <div className={styles.price}>
                  <span className={styles.currency}>R</span>
                  <span className={styles.amount}>15</span>
                  <span className={styles.period}>/month</span>
                </div>
              </div>
              <div className={styles.pricingFeatures}>
                <div className={styles.feature}>
                  <i className="fa-regular fa-check-circle"></i>
                  <span>Verified Badge on Profile & Listings</span>
                </div>
                <div className={styles.feature}>
                  <i className="fa-regular fa-check-circle"></i>
                  <span>Ad-Free Browsing Experience</span>
                </div>
                <div className={styles.feature}>
                  <i className="fa-regular fa-check-circle"></i>
                  <span>Increased Buyer Trust</span>
                </div>
                <div className={styles.feature}>
                  <i className="fa-regular fa-check-circle"></i>
                  <span>Fraud & Theft Protection</span>
                </div>
                <div className={styles.feature}>
                  <i className="fa-regular fa-check-circle"></i>
                  <span>Priority Listing (Coming Soon)</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.paymentSection}>
            <h2 className={styles.sectionTitle}>Choose Payment Method</h2>
            <p className={styles.paymentSubtitle}>
              Secure payment processing. Your information is safe and encrypted.
            </p>
            <div className={styles.paymentMethods}>
              <div 
                className={`${styles.paymentCard} ${selectedPayment === 'ozow' ? styles.selected : ''}`}
                onClick={() => !processing && setSelectedPayment('ozow')}
              >
                <div className={styles.paymentLogo}>
                  <div className={styles.ozowLogo}>OZOW</div>
                </div>
                <h3 className={styles.paymentName}>Ozow</h3>
                <p className={styles.paymentDescription}>
                  Instant EFT payments directly from your bank account
                </p>
                <div className={styles.paymentFeatures}>
                  <span><i className="fa-regular fa-check"></i> Instant</span>
                  <span><i className="fa-regular fa-check"></i> Secure</span>
                  <span><i className="fa-regular fa-check"></i> No Card Needed</span>
                </div>
              </div>

              <div 
                className={`${styles.paymentCard} ${selectedPayment === 'payfast' ? styles.selected : ''}`}
                onClick={() => !processing && setSelectedPayment('payfast')}
              >
                <div className={styles.paymentLogo}>
                  <div className={styles.payfastLogo}>PayFast</div>
                </div>
                <h3 className={styles.paymentName}>PayFast</h3>
                <p className={styles.paymentDescription}>
                  Credit card, debit card, or EFT payments
                </p>
                <div className={styles.paymentFeatures}>
                  <span><i className="fa-regular fa-check"></i> Multiple Options</span>
                  <span><i className="fa-regular fa-check"></i> Secure</span>
                  <span><i className="fa-regular fa-check"></i> Widely Accepted</span>
                </div>
              </div>
            </div>

            {selectedPayment && (
              <div className={styles.paymentAction}>
                <button
                  onClick={() => handlePayment(selectedPayment)}
                  className={styles.payButton}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Pay R15/month with ${selectedPayment === 'ozow' ? 'Ozow' : 'PayFast'}`}
                </button>
                <p className={styles.paymentNote}>
                  You will be redirected to the secure payment gateway. 
                  Your subscription will activate immediately upon successful payment.
                </p>
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Important Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <i className="fa-regular fa-lock"></i>
                </div>
                <h3 className={styles.infoTitle}>Security First</h3>
                <p>
                  All payment information is processed securely through trusted payment gateways. 
                  We never store your payment details.
                </p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <i className="fa-regular fa-file-check"></i>
                </div>
                <h3 className={styles.infoTitle}>Verification Process</h3>
                <p>
                  After payment, we'll verify your identity using the information from your registration. 
                  This typically takes 24-48 hours.
                </p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <i className="fa-regular fa-arrow-rotate-left"></i>
                </div>
                <h3 className={styles.infoTitle}>Cancel Anytime</h3>
                <p>
                  You can cancel your subscription at any time from your settings. 
                  Your verified status remains until the end of your billing period.
                </p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <i className="fa-regular fa-circle-question"></i>
                </div>
                <h3 className={styles.infoTitle}>Need Help?</h3>
                <p>
                  Have questions about verification? Contact our support team for assistance 
                  with the verification process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default GetVerified

