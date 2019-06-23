var Navigo = require('navigo');
var router = new Navigo(null, true);
var worker = require('../shared/worker');
var detailViewOrchestrator = require('./detailViewOrchestrator');

var lastNationalId;
var landedOnMainView;
var scrollPos;

router
  .on('/pokemon/:nationalId', params => {
    var nationalId = parseInt(params.nationalId, 10);
    worker.postMessage({
      type: 'detail',
      nationalId: nationalId
    });
    detailViewOrchestrator.animateInPartOne(nationalId);
    lastNationalId = nationalId;
  })
  .on('/', () => {
    landedOnMainView = true;
    if (typeof lastNationalId === 'number') {
      // not initial load
      detailViewOrchestrator.animateOut(lastNationalId);
    }
  })
  .resolve();

function toMonsterDetail(nationalId) {
  scrollPos = document.documentElement.scrollTop || document.body.scrollTop;
  console.log('here 1', scrollPos);
  router.navigate('/pokemon/' + nationalId);
}

function toMainView() {
  if (landedOnMainView) {
    history.back();
  } else {
    // didn't land on main view, don't do a back action
    router.navigate('/');
  }

  if (scrollPos) {
    setTimeout(() => {
      console.log('here 3');
      document.documentElement.scrollTop = scrollPos;
    }, 500);
  }
}

module.exports = {
  toMonsterDetail,
  toMainView
};
