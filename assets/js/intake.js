/* ========================================================
   TELEMEDICINE INTAKE QUESTIONNAIRE — ELORA RX
   Manages 5-step clinical intake, validation, BMI calculator,
   animated step transitions, and physician matching.
   ======================================================== */
(function () {
  'use strict';

  /* ── State ──────────────────────────────────────────── */
  let currentStep = 1;
  const TOTAL_STEPS = 5;

  const intakeData = {
    supportGoals: ['prescription-online'],
    treatment: 'weight-loss',
    medicalHistory: ['none'],
    state: 'California',
    dobMonth: '06',
    dobDay: '15',
    dobYear: '1992',
    sex: 'female',
    heightFt: 5,
    heightIn: 7,
    weightLbs: 168,
    bmi: 26.3,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    consultType: 'async',
    consent: true
  };

  /* ── DOM References ─────────────────────────────────── */
  const stepPanes       = document.querySelectorAll('.intake-step-pane');
  const stepSegments    = document.querySelectorAll('.intake-stepbar-seg');
  const stepCounterLabel = document.getElementById('stepCounterLabel');
  const backBtn         = document.getElementById('intakeBackBtn');
  const nextBtn         = document.getElementById('intakeNextBtn');
  const bottomAction    = document.getElementById('intakeBottomAction');
  const errorMessage    = document.getElementById('intakeErrorMessage');
  const successContainer = document.getElementById('intakeSuccessContainer');
  const matchedStateEl  = document.getElementById('matchedDoctorState');

  /* ═══════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════ */
  function init() {
    bindStep1();
    bindStep2();
    bindStep3();
    bindStep4();
    bindStep5();
    bindNavigation();
    recalcBmi();
    updateUI(1);
  }

  /* ═══════════════════════════════════════════════════════
     STEP 1: SUPPORT NEEDED (Single select only)
     ═══════════════════════════════════════════════════════ */
  function bindStep1() {
    const cards = document.querySelectorAll('#step1Stack .intake-stack-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        intakeData.supportGoals = [card.dataset.val];
        clearError();
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     STEP 2: TREATMENT FOCUS (Single select only)
     ═══════════════════════════════════════════════════════ */
  function bindStep2() {
    // Pre-select treatment from URL query parameter if present (e.g. ?treatment=weight-loss)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const treatmentParam = urlParams.get('treatment');
      if (treatmentParam) {
        const targetCard = document.querySelector(`#step2Stack .intake-stack-card[data-val="${treatmentParam}"]`);
        if (targetCard) {
          const cards = document.querySelectorAll('#step2Stack .intake-stack-card');
          cards.forEach(c => c.classList.remove('is-selected'));
          targetCard.classList.add('is-selected');
          intakeData.treatment = treatmentParam;
        }
      }
    } catch (e) {
      // ignore param parsing error if any
    }

    const cards = document.querySelectorAll('#step2Stack .intake-stack-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        intakeData.treatment = card.dataset.val;
        clearError();
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     STEP 3: MEDICAL HISTORY & SAFETY (Single select only)
     ═══════════════════════════════════════════════════════ */
  function bindStep3() {
    const cards = document.querySelectorAll('#step3Stack .intake-stack-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        intakeData.medicalHistory = [card.dataset.val];
        clearError();
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     STEP 4: STATE, DEMOGRAPHICS & BMI
     ═══════════════════════════════════════════════════════ */
  function bindStep4() {
    const stateSelect = document.getElementById('intakeStateSelect');
    const sexPills    = document.querySelectorAll('.intake-sex-pill');
    const heightFt    = document.getElementById('heightFt');
    const heightIn    = document.getElementById('heightIn');
    const weightLbs   = document.getElementById('weightLbs');
    const dobMonth    = document.getElementById('dobMonth');
    const dobDay      = document.getElementById('dobDay');
    const dobYear     = document.getElementById('dobYear');

    if (stateSelect) {
      stateSelect.addEventListener('change', (e) => {
        intakeData.state = e.target.value;
        if (matchedStateEl) matchedStateEl.textContent = intakeData.state;
      });
    }

    sexPills.forEach(pill => {
      pill.addEventListener('click', () => {
        sexPills.forEach(p => p.classList.remove('is-selected'));
        pill.classList.add('is-selected');
        intakeData.sex = pill.dataset.sex || 'female';
      });
    });

    if (heightFt) heightFt.addEventListener('change', recalcBmi);
    if (heightIn) heightIn.addEventListener('change', recalcBmi);
    if (weightLbs) weightLbs.addEventListener('input', recalcBmi);

    if (dobMonth) dobMonth.addEventListener('input', (e) => { intakeData.dobMonth = e.target.value; });
    if (dobDay) dobDay.addEventListener('input', (e) => { intakeData.dobDay = e.target.value; });
    if (dobYear) dobYear.addEventListener('input', (e) => { intakeData.dobYear = e.target.value; });
  }

  function recalcBmi() {
    const ftEl = document.getElementById('heightFt');
    const inEl = document.getElementById('heightIn');
    const wtEl = document.getElementById('weightLbs');
    const scoreEl = document.getElementById('bmiScore');
    const metaEl  = document.getElementById('bmiMeta');

    const ft = parseFloat(ftEl?.value || '5');
    const inches = parseFloat(inEl?.value || '7');
    const wt = parseFloat(wtEl?.value || '168');

    const totalInches = (ft * 12) + inches;
    if (totalInches > 0 && wt > 0) {
      const bmi = ((wt * 703) / (totalInches * totalInches)).toFixed(1);
      intakeData.bmi = parseFloat(bmi);
      intakeData.heightFt = ft;
      intakeData.heightIn = inches;
      intakeData.weightLbs = wt;

      if (scoreEl) scoreEl.textContent = bmi;
      if (metaEl) {
        if (bmi < 18.5) {
          metaEl.textContent = 'Underweight • Tailored metabolic protocol';
        } else if (bmi < 25) {
          metaEl.textContent = 'Normal range • Qualified for care';
        } else if (bmi < 30) {
          metaEl.textContent = 'Elevated metabolic range • Qualified for care';
        } else {
          metaEl.textContent = 'Clinical weight range • Qualified for care';
        }
      }
    }
  }

  /* ═══════════════════════════════════════════════════════
     STEP 5: CONTACT INFORMATION
     ═══════════════════════════════════════════════════════ */
  function bindStep5() {
    const fn = document.getElementById('firstName');
    const ln = document.getElementById('lastName');
    const em = document.getElementById('emailAddress');
    const ph = document.getElementById('phoneNumber');
    const consent = document.getElementById('consentCheck');
    const consultCards = document.querySelectorAll('.consult-card');

    if (fn) fn.addEventListener('input', (e) => { intakeData.firstName = e.target.value.trim(); });
    if (ln) ln.addEventListener('input', (e) => { intakeData.lastName = e.target.value.trim(); });
    if (em) em.addEventListener('input', (e) => { intakeData.email = e.target.value.trim(); });
    if (ph) {
      ph.addEventListener('input', (e) => {
        let cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
        let formatted = cleaned;
        if (cleaned.length > 6) {
          formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        } else if (cleaned.length > 3) {
          formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        }
        e.target.value = formatted;
        intakeData.phone = formatted;
      });
    }

    if (consent) consent.addEventListener('change', (e) => { intakeData.consent = e.target.checked; });

    consultCards.forEach(c => {
      c.addEventListener('click', () => {
        consultCards.forEach(card => card.classList.remove('is-selected'));
        c.classList.add('is-selected');
        intakeData.consultType = c.dataset.val;
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     NAVIGATION (Back / Next)
     ═══════════════════════════════════════════════════════ */
  function bindNavigation() {
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          goToStep(currentStep - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
          if (currentStep < TOTAL_STEPS) {
            goToStep(currentStep + 1);
          } else {
            submitIntake();
          }
        }
      });
    }
  }

  function goToStep(step) {
    if (step < 1 || step > TOTAL_STEPS) return;
    currentStep = step;
    updateUI(currentStep);

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateUI(step) {
    // 1. Show active step pane
    stepPanes.forEach(pane => {
      const s = parseInt(pane.dataset.step, 10);
      pane.classList.toggle('active', s === step);
    });

    // 2. Update 5-segment step bar on top area
    stepSegments.forEach((seg, i) => {
      const segStep = i + 1;
      seg.classList.remove('active', 'completed');
      if (segStep <= step) {
        seg.classList.add('active');
      }
    });

    // 3. Update step counter label
    if (stepCounterLabel) {
      stepCounterLabel.textContent = `Step ${step} of 5`;
    }

    // 4. Update back button visibility
    if (backBtn) {
      backBtn.classList.toggle('is-hidden', step === 1);
    }

    // 5. Update next button text
    if (nextBtn) {
      nextBtn.textContent = step === TOTAL_STEPS ? 'Submit for Doctor Review' : 'Next';
    }

    clearError();
  }

  /* ═══════════════════════════════════════════════════════
     VALIDATION
     ═══════════════════════════════════════════════════════ */
  function validateStep(step) {
    clearError();

    if (step === 1) {
      const selected = document.querySelectorAll('#step1Stack .intake-stack-card.is-selected');
      if (selected.length === 0) {
        showError('Please select at least one option to continue.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      const selected = document.querySelectorAll('#step2Stack .intake-stack-card.is-selected');
      if (selected.length === 0) {
        showError('Please select a treatment area to continue.');
        return false;
      }
      return true;
    }

    if (step === 3) {
      const selected = document.querySelectorAll('#step3Stack .intake-stack-card.is-selected');
      if (selected.length === 0) {
        showError('Please select all that apply or "None of the above".');
        return false;
      }
      return true;
    }

    if (step === 4) {
      const stateEl = document.getElementById('intakeStateSelect');
      if (!stateEl || !stateEl.value) {
        showError('Please select your state of residence.');
        return false;
      }
      const dobY = document.getElementById('dobYear');
      const currentYear = new Date().getFullYear();
      if (dobY && dobY.value) {
        const yr = parseInt(dobY.value, 10);
        if (isNaN(yr) || currentYear - yr < 18) {
          showError('You must be at least 18 years old to access telemedicine prescription care.');
          return false;
        }
      }
      return true;
    }

    if (step === 5) {
      const fn = document.getElementById('firstName');
      const ln = document.getElementById('lastName');
      const em = document.getElementById('emailAddress');
      const ph = document.getElementById('phoneNumber');
      const consent = document.getElementById('consentCheck');

      if (!fn || !fn.value.trim()) {
        showError('Please enter your first name.');
        fn?.focus();
        return false;
      }
      if (!ln || !ln.value.trim()) {
        showError('Please enter your last name.');
        ln?.focus();
        return false;
      }
      if (!em || !em.value.trim() || !em.value.includes('@')) {
        showError('Please enter a valid email address.');
        em?.focus();
        return false;
      }
      if (!ph || ph.value.replace(/\D/g, '').length < 10) {
        showError('Please enter a valid 10-digit phone number.');
        ph?.focus();
        return false;
      }
      if (!consent || !consent.checked) {
        showError('Please agree to the Telehealth Consent to submit.');
        return false;
      }
      return true;
    }

    return true;
  }

  function showError(msg) {
    if (errorMessage) {
      errorMessage.textContent = msg;
      errorMessage.style.display = 'block';
    } else {
      alert(msg);
    }
  }

  function clearError() {
    if (errorMessage) {
      errorMessage.textContent = '';
      errorMessage.style.display = 'none';
    }
  }

  /* ═══════════════════════════════════════════════════════
     SUBMIT
     ═══════════════════════════════════════════════════════ */
  function submitIntake() {
    // Hide question panes, back arrow, and bottom button
    stepPanes.forEach(pane => pane.classList.remove('active'));
    if (backBtn) backBtn.classList.add('is-hidden');
    if (bottomAction) bottomAction.style.display = 'none';

    // Set all topbar segments to active
    stepSegments.forEach(seg => seg.classList.add('active'));
    if (stepCounterLabel) stepCounterLabel.textContent = 'Completed';

    // Update state on doctor card
    if (matchedStateEl) matchedStateEl.textContent = intakeData.state;

    // Show success container
    if (successContainer) {
      successContainer.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /* ═══════════════════════════════════════════════════════
     KICKOFF
  ═══════════════════════════════════════════════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
