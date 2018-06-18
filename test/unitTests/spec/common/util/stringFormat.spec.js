describe('stringFormat', () => {
    describe('toValidId', () => {
        it('should replace all the spaces with hyphens to make it a valid html id value', () => {
            expect("Radiology Test section".toValidId()).toEqual("Radiology-Test-section");
        });

        it('should replace nothing', () => {
            expect("Radiology".toValidId()).toEqual("Radiology");
        });
    });
});
