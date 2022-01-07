module.exports = {
    pathSrc: './src/html/templates/',
    pathDist: './src/js/gen/templates/',
    inputs: (() => {
        const inputs = [];

        //#region battci
        if (true) {
            inputs.push({
                name: 'battci',
                // inputs: [
                //     {
                //         name: 'battci_mobile',
                //         inputs: [{
                //             name: 'battci_phoneapp'
                //         }]
                //     }
                // ]
            });

            //#region battci_admin
            // inputs.push({
            //     name: 'battci_admin_hKd32kdhzP',
            //     basedOn: 'battci',
            //     inputs: [
            //         {
            //             name: 'battci_mobile_admin_hKd32kdhzP',
            //             basedOn: 'battci_mobile',
            //             inputs: [
            //                 {
            //                     name: 'battci_phoneapp_admin_hKd32kdhzP',
            //                     basedOn: 'battci_phoneapp'
            //                 }
            //             ]
            //         }
            //     ]
            // });
        }

        return inputs;
    })(),
    imports: (() => { // Move to inputs field
        const imports = { list: {}, type: 'commonjs' };

        //#region battci
        if (true) {
            const battci__imports = {
                import: '',
                from: '@/spa/battci/_exports.js'
            };

            // const battci_admin_hKd32kdhzP__imports = {
            //     import: 'bAccount_viewAdmin,tabAdminkaAddstart,tabAdminkaContinent,tabAdminkaLog,wAdminFeed,wAdminka,wAdminTownInfo,wAdminTrade',
            //     from: '@/spa/battci/__admin/hKd32kdhzP/_exports.js'
            // };

            // const battci_mobile__imports = {
            //     import: '',
            //     from: '@/spa/battci/__mobile/_exports.js'
            // };

            // const battci_phoneapp__imports = {
            //     import: '',
            //     from: '@/spa/battci/__phoneapp/_exports.js'
            // };


            imports.list.battci = [battci__imports];

            // imports.list.battci_admin_hKd32kdhzP = [battci__imports, battci_admin_hKd32kdhzP__imports];

            // imports.list.battci_mobile = [battci__imports, battci_mobile__imports];

            // imports.list.battci_phoneapp = [battci__imports, battci_mobile__imports, battci_phoneapp__imports];

            // imports.list.battci_mobile_admin_hKd32kdhzP = [battci__imports, battci_admin_hKd32kdhzP__imports, battci_mobile__imports];

            // imports.list.battci_phoneapp_admin_hKd32kdhzP = [battci__imports, battci_admin_hKd32kdhzP__imports, battci_mobile__imports, battci_phoneapp__imports];
        }

        return imports;
    })()
};