/**
 * jQuery Accordion Live Filter
 * @author Aaron Saray
 */
;(function($) {

    /**
     * Accordion Filter plugin
     * @returns {*}
     */
    $.fn.accordionLiveFilter = function() {

        return this.each(function() {
            var $filterField = $(this);

            var selector = $filterField.data('alf');
            if (!selector) {
                throw new Error('The accordion search filter element needs a data-alf element with a jquery selector.');
            }

            var $accordion = $(selector);
            if ($accordion.length == 0) {
                throw new Error('The selector ' + selector + ' was not found.');
            }

            $('label', $accordion).on('expand', function() {
                var $label = $(this);
                $label.addClass('expanded');
                $label.next('ul').slideDown();
            }).on('contract', function() {
                var $label = $(this);
                $label.removeClass('expanded');
                $label.next('ul').slideUp();
            }).on('click', function() {
                var $label = $(this);
                if ($label.hasClass('expanded')) {
                    $label.trigger('contract');
                }
                else {
                    $label.trigger('expand');
                }
            });

            $filterField.on('keyup', function() {
                var query = $filterField.val().toLowerCase();
                $('li > ul', $accordion).each(function(index, element) {
                    var $ul = $(element);
                    var $ulChildren = $ul.children();
                    $ulChildren.removeClass('potential');

                    if (query) {
                        var ulText = $ul.text();
                        var idx = ulText.toLowerCase().indexOf(query);
                        if (idx >= 0) {
                            $ulChildren.each(function(i, e) {
                                var $e = $(e);
                                if ($e.text().toLowerCase().indexOf(query) >= 0) {
                                    $e.addClass('potential');
                                }
                            });
                            $ul.prev('label').trigger('expand');
                            return true;
                        }
                    }
                    $ul.prev('label').trigger('contract');
                });
            });
        });
    };
}(jQuery));

