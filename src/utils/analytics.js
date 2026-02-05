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
export function trackCallButtonClick(callback) {
  if (typeof window.gtag === 'function') {
    let called = false;
    const done = () => {
      if (!called) {
        called = true;
        callback?.();
      }
    };
    window.gtag('event', 'call_button_click', {
      event_category: 'engagement',
      event_label: 'Call Us Button',
      phone_number: '+30 698 091 1843',
      debug_mode: true,
      event_callback: done
    });
    setTimeout(done, 300);
  } else {
    callback?.();
  }
}

/**
 * Track when a user clicks on a phone number link
 * @param {string} source - Where the phone link was clicked (e.g., 'footer', 'contact_section')
 * @param {string} linkType - Type of link (e.g., 'tel', 'whatsapp', 'viber')
 */
export function trackPhoneClick(source, linkType = 'tel', callback) {
  if (typeof window.gtag === 'function') {
    let called = false;
    const done = () => {
      if (!called) {
        called = true;
        callback?.();
      }
    };
    window.gtag('event', 'phone_number_click', {
      event_category: 'engagement',
      event_label: `Phone Click - ${source}`,
      phone_number: '+30 698 091 1843',
      link_type: linkType,
      debug_mode: true,
      event_callback: done
    });
    setTimeout(done, 300);
  } else {
    callback?.();
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
