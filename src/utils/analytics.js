/**
 * Google Analytics 4 Event Tracking Utility
 *
 * This file provides helper functions for tracking custom events
 * that can be used for Google Ads conversion tracking.
 */

/**
 * Track when a user clicks the "Call Us" button
 * This event can be used for Google Ads conversion tracking
 */
export function trackCallButtonClick() {
  console.log('trackCallButtonClick called');
  if (typeof window.gtag === 'function') {
    console.log('gtag is available, sending event');
    window.gtag('event', 'call_button_click', {
      event_category: 'conversion',
      event_label: 'Call Us Button',
      phone_number: '+30 698 091 1843'
    });
    console.log('%c✅ Event sent to GA4: call_button_click', 'color: green; font-weight: bold;');
  } else {
    console.warn('⚠️ gtag is not available yet - GA4 script may not have loaded');
  }
}

/**
 * Track when a user clicks on a phone number link
 * @param {string} source - Where the phone link was clicked (e.g., 'footer', 'contact_section')
 * @param {string} linkType - Type of link (e.g., 'tel', 'whatsapp', 'viber')
 */
export function trackPhoneClick(source, linkType = 'tel') {
  console.log(`trackPhoneClick called: ${source} - ${linkType}`);
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'phone_number_click', {
      event_category: 'conversion',
      event_label: `Phone Click - ${source}`,
      phone_number: '+30 698 091 1843',
      link_type: linkType
    });
    console.log(`%c✅ Event sent to GA4: phone_number_click (${source})`, 'color: green; font-weight: bold;');
  } else {
    console.warn('⚠️ gtag is not available yet - GA4 script may not have loaded');
  }
}

/**
 * Track booking form submissions
 * This can be used for tracking conversion when users submit booking requests
 */
export function trackBookingSubmission(bookingType) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'booking_submission', {
      event_category: 'conversion',
      event_label: 'Booking Form Submitted',
      booking_type: bookingType
    });
  }
}

/**
 * Generic event tracker
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Additional parameters for the event
 */
export function trackEvent(eventName, eventParams = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }
}
