(function ($) {
  'use strict';

  // Background-images
  $('[data-background]').each(function () {
    $(this).css({
      'background-image': 'url(' + $(this).data('background') + ')',
    });
  });

  // Accordions
  $('.collapse')
    .on('shown.bs.collapse', function () {
      $(this)
        .parent()
        .find('.ti-plus')
        .removeClass('ti-plus')
        .addClass('ti-minus');
    })
    .on('hidden.bs.collapse', function () {
      $(this)
        .parent()
        .find('.ti-minus')
        .removeClass('ti-minus')
        .addClass('ti-plus');
    });

  // match height
  $(function () {
    $('.match-height').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false,
    });
  });

  // Get Parameters from some url
  var getUrlParameter = function getUrlParameter(sPageURL) {
    var url = sPageURL.split('?');
    var obj = {};
    if (url.length == 2) {
      var sURLVariables = url[1].split('&'),
        sParameterName,
        i;
      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        obj[sParameterName[0]] = sParameterName[1];
      }
      return obj;
    } else {
      return undefined;
    }
  };

  // Execute actions on images generated from Markdown pages
  var images = $('.content img').not('.inline');
  // Wrap image inside a featherlight (to get a full size view in a popup)
  images.wrap(function () {
    var image = $(this);
    if (!image.parent('a').length) {
      return "<a href='" + image[0].src + "' data-featherlight='image'></a>";
    }
  });

  // Change styles, depending on parameters set to the image
  images.each(function (index) {
    var image = $(this);
    var o = getUrlParameter(image[0].src);
    if (typeof o !== 'undefined') {
      var h = o['height'];
      var w = o['width'];
      var c = o['classes'];
      image.css('width', function () {
        if (typeof w !== 'undefined') {
          return w;
        } else {
          return 'auto';
        }
      });
      image.css('height', function () {
        if (typeof h !== 'undefined') {
          return h;
        } else {
          return 'auto';
        }
      });
      if (typeof c !== 'undefined') {
        var classes = c.split(',');
        for (i = 0; i < classes.length; i++) {
          image.addClass(classes[i]);
        }
      }
    }
  });

  // tab
  $('.tab-content')
    .find('.tab-pane')
    .each(function (idx, item) {
      var navTabs = $(this).closest('.code-tabs').find('.nav-tabs'),
        title = $(this).attr('title');
      navTabs.append(
        '<li class="nav-item"><a class="nav-link" href="#">' +
          title +
          '</a></li>'
      );
    });

  $('.code-tabs ul.nav-tabs').each(function () {
    $(this).find('li:first').addClass('active');
  });

  $('.code-tabs .tab-content').each(function () {
    $(this).find('div:first').addClass('active');
  });

  $('.nav-tabs a').click(function (e) {
    e.preventDefault();
    var tab = $(this).parent(),
      tabIndex = tab.index(),
      tabPanel = $(this).closest('.code-tabs'),
      tabPane = tabPanel.find('.tab-pane').eq(tabIndex);
    tabPanel.find('.active').removeClass('active');
    tab.addClass('active');
    tabPane.addClass('active');
  });

  // search
  $('#search').keyup(function () {
    if (this.value) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });
  $('#search').focusout(function () {
    $(this).removeClass('active');
  });

  // Download page to pdf format
  window.onload = function () {
    var generatePDF = document.getElementById('generatePDF');
    if (typeof generatePDF != 'undefined' && generatePDF != null) {
      generatePDF.addEventListener('click', () => {
        const content = this.document.getElementById('content');
        console.log(content);
        console.log(window);
        var opt = {
          margin: 1,
          filename: document.querySelector('#title').innerHTML,
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scale: 2},
          jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'},
        };
        html2pdf().from(content).set(opt).save();
      });
    }
  };
})(jQuery);
/*Krishantha Dinesh
to support collapsible code
*/
var height = '300px';

if (
  document.readyState === 'complete' ||
  (document.readyState !== 'loading' && !document.documentElement.doScroll)
) {
  makeCollapsible();
} else {
  document.addEventListener('DOMContentLoaded', makeCollapsible);
}

function toggle(e) {
  e.preventDefault();
  var link = e.target;
  var div = link.parentElement.parentElement;

  if (link.innerHTML == 'more&nbsp;') {
    link.innerHTML = 'less&nbsp;';
    div.style.maxHeight = '';
    div.style.overflow = 'none';
  } else {
    link.innerHTML = 'more&nbsp;';
    div.style.maxHeight = height;
    div.style.overflow = 'hidden';
    div.scrollIntoView({behavior: 'smooth'});
  }
}

function makeCollapsible() {
  var divs = document.querySelectorAll('.highlight-wrapper');

  for (i = 0; i < divs.length; i++) {
    var div = divs[i];
    if (div.offsetHeight > parseInt(height, 10)) {
      div.style.maxHeight = height;
      div.style.overflow = 'hidden';

      var e = document.createElement('div');
      e.className = 'highlight-link';

      var html = '<a href="">more&nbsp;</a>';
      e.innerHTML = html;
      div.appendChild(e);
    }
  }

  var links = document.querySelectorAll('.highlight-link');
  for (i = 0; i < links.length; i++) {
    var link = links[i];
    link.addEventListener('click', toggle);
  }
}
