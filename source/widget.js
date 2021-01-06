let settings = {
  "incrementValue": 10,
  "decrementThreshold": 50 // If sub goal minus current sub count is greater than this, decrease sub goal
}

let state = {
  "currentCount": 0,
  "goalCount": 1
}

// Variables
let timeline = gsap.timeline();

// Play Update
function playUpdate() {
  // Generate HTML
  let text_html = `<span>Sub Goal: ${state.currentCount}/${state.goalCount}</span>`;

  // Set initial states
  gsap.set('.text', {
    opacity: 100
  });

  // Animate Out
  timeline.to('.text', {
    opacity: 0,
    duration: 1,
    ease: 'expo.out',
    onComplete: function() {
      // Apply new counts' html
      $('.text').html(text_html);
    }
  });

  // Animate In
  timeline.to('.text', {
    delay: 1,
    opacity: 100,
    duration: 1,
    ease: 'expo.in'
  });
}

function updateCounts() {
  if ((state.currentCount >= state.goalCount) || ((state.goalCount - state.currentCount) > settings.decrementThreshold)) {
    state.goalCount = Math.round((state.currentCount + settings.incrementValue) / 10) * 10; // Rounds goal count to nearest 10
  }

  playUpdate();
}

// On widget load, setup settings/state etc
window.addEventListener('onWidgetLoad', function(obj) {
  console.log('ON WIDGET LOAD')
  console.log(obj)
  
  let fieldData = obj.detail.fieldData;

  settings.incrementValue = fieldData.incrementValue;
  settings.decrementThreshold = fieldData.decrementThreshold;

  if (obj.detail.session.data["subscriber-total"].count) {
    state.currentCount = obj.detail.session.data["subscriber-total"].count;
  }
  
  if (fieldData.goalCount > state.goalCount) {
    state.goalCount = fieldData.goalCount;
  }

  updateCounts();
});

// On new event received
window.addEventListener('onEventReceived', function(obj) {
  const listener = obj.detail.listener;

  if (listener === "subscriber-latest") {
    state.currentCount++;

    updateCounts();
  }
});