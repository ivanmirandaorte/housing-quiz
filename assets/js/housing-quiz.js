/* Housing Quiz — no tracking, no cookies, no external requests */
(function () {
	'use strict';

	/* ── Data ── */
	var QUESTIONS = [
		'Do you have a valid government-issued photo ID?',
		'Is your monthly household income at least $860–$3,150, depending on the property/unit you are interested in?',
		'Can you provide current documentation verifying your income?',
		'Are you willing to complete the required background check as part of the application process?'
	];

	var OPTIONS = [
		{ key: 'A', label: 'Yes', eligible: true },
		{ key: 'B', label: 'No',  eligible: false }
	];

	/* Any "No" → not eligible. "Yes" to every question → eligible. */
	var RESULTS = {
		eligible: {
			showApply: true,
			body: [
				'You have been pre-approved! Please fill out your application.'
			]
		},
		notEligible: {
			body: [
				'At this time you do not meet the pre-qualifications. We welcome you to apply again in future.'
			]
		}
	};

	/* ── State ── */
	var currentQ   = 0;
	var selected   = null;
	var answerHistory = []; // Track answers for back navigation

	/* ── Elements ── */
	var scQuestion = document.getElementById('pq-question');
	var scResult   = document.getElementById('pq-result');
	var progFill   = document.getElementById('pq-prog-fill');
	var progBar    = progFill.parentElement;
	var elNum      = document.getElementById('pq-num');
	var elText     = document.getElementById('pq-text');
	var elOpts     = document.getElementById('pq-opts');
	var btnOk      = document.getElementById('pq-btn-ok');
	var btnBack    = document.getElementById('pq-btn-back');
	var btnRetake  = document.getElementById('pq-btn-retake');
	var btnApply   = document.getElementById('pq-btn-apply');
	var elResBody  = document.getElementById('pq-res-body');

	/* ── Progress ── */
	function setProgress(step) {
		var pct = Math.round((step / QUESTIONS.length) * 100);
		progFill.style.width = pct + '%';
		progBar.setAttribute('aria-valuenow', pct);
	}

	/* ── Screen transitions ── */
	function switchScreen(next) {
		var screens = [scQuestion, scResult];
		var current = screens.find(function (s) { return s.classList.contains('pq-active'); });

		if (current === next) return;

		if (current) {
			current.classList.add('pq-out');
			current.addEventListener('animationend', function onOut() {
				current.removeEventListener('animationend', onOut);
				current.classList.remove('pq-active', 'pq-out');
				current.style.display = 'none';
				revealScreen(next);
			}, { once: true });
		} else {
			revealScreen(next);
		}
	}

	function revealScreen(s) {
		s.style.display = 'flex';
		/* Force reflow so animation fires */
		void s.offsetWidth;
		s.classList.add('pq-active');
	}

	/* ── Render question ── */
	function renderQuestion(idx) {
		selected = null;
		elNum.textContent = idx + 1;
		elText.textContent = QUESTIONS[idx];
		elOpts.innerHTML = '';
		btnOk.disabled = true;

		OPTIONS.forEach(function (opt, i) {
			var btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'pq-option';
			btn.setAttribute('role', 'radio');
			btn.setAttribute('aria-checked', 'false');
			btn.dataset.idx = i;
			btn.innerHTML =
				'<span class="pq-badge" aria-hidden="true">' + opt.key + '</span>' +
				'<span class="pq-option-label">' + opt.label + '</span>';
			btn.addEventListener('click', function () { pick(i); });
			elOpts.appendChild(btn);
		});

		// Restore answer from history if it exists
		if (answerHistory[idx] !== undefined) {
			pick(answerHistory[idx]);
		}

		setProgress(idx);
		updateBackBtn();
	}

	/* ── Select answer ── */
	function pick(idx) {
		selected = idx;
		elOpts.querySelectorAll('.pq-option').forEach(function (el, i) {
			el.classList.toggle('pq-selected', i === idx);
			el.setAttribute('aria-checked', i === idx ? 'true' : 'false');
		});
		btnOk.disabled = false;
	}

	/* ── Update back button state ── */
	function updateBackBtn() {
		if (currentQ > 0) {
			btnBack.style.opacity = '1';
			btnBack.style.pointerEvents = 'auto';
		} else {
			btnBack.style.opacity = '0.6';
			btnBack.style.pointerEvents = 'none';
		}
	}

	/* ── Go back to previous question ── */
	function goBack() {
		if (currentQ <= 0) return;
		
		currentQ--;
		renderQuestion(currentQ);
		switchScreen(scQuestion);
	}

	/* ── Advance ── */
	function advance() {
		if (selected === null) return;
		
		// Store answer in history
		answerHistory[currentQ] = selected;

		// A single "No" ends the quiz
		if (!OPTIONS[selected].eligible) {
			showResult(RESULTS.notEligible);
			return;
		}

		currentQ++;

		if (currentQ >= QUESTIONS.length) {
			showResult(RESULTS.eligible);
		} else {
			renderQuestion(currentQ);
			switchScreen(scQuestion);
		}
	}

	/* ── Show result ── */
	function showResult(result) {
		setProgress(QUESTIONS.length);

		// Apply link only for eligible results; Retake becomes secondary beside it
		btnApply.hidden = !result.showApply;
		btnRetake.classList.toggle('pq-btn-secondary', !!result.showApply);

		elResBody.innerHTML = '';
		result.body.forEach(function (para) {
			var p = document.createElement('p');
			p.textContent = para;
			elResBody.appendChild(p);
		});

		switchScreen(scResult);
	}

	/* ── Reset ── */
	function reset() {
		currentQ = 0;
		selected = null;
		answerHistory = [];
		renderQuestion(0);
		switchScreen(scQuestion);
	}

	/* Initialize by going directly to first question */
	reset();

	/* ── Keyboard ── */
	document.addEventListener('keydown', function (e) {
		if (!scQuestion.classList.contains('pq-active')) return;
		var k = e.key.toUpperCase();
		if      (k === 'A' || k === '1') pick(0);
		else if (k === 'B' || k === '2') pick(1);
		else if (k === 'ENTER' && selected !== null) { e.preventDefault(); advance(); }
		else if (k === 'BACKSPACE' && currentQ > 0) { e.preventDefault(); goBack(); }
	});

	/* ── Events ── */
	btnOk.addEventListener('click',     advance);
	btnBack.addEventListener('click',   goBack);
	btnRetake.addEventListener('click', reset);

}());
