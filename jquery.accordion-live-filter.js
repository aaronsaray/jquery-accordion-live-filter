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

        /**
         * Adds the handler to the accordion element
         * @param $element
         */
        function addAccordionHandler($element)
        {
            $('label', $element).on('click', expand);
        }

        function expand()
        {
            $(this).toggleClass('expanded').next().slideToggle();
        }

        function addFilterHandler($filterField, $accordion)
        {
            $filterField.on('keyup', function() {
                var query = $filterField.val().toLowerCase();
                $('li > ul', $accordion).each(function(index, element) {
                    var ul = $(element);
                    if (query && ul.text().toLowerCase().indexOf(query) >= 0) {
                        ul.show();
                    }
                    else {
                        ul.hide();
                    }
                });
            });
        }

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

            addAccordionHandler($accordion);
            addFilterHandler($filterField, $accordion);
        });
    };
}(jQuery));

