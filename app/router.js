import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType//,
    //rootURL: config.baseURL
});

Router.map(function() {
    //this.route('application', {path: '/'});
    this.route('application', {path: "/"}, function () {
        this.route('login/main', {path: '/login'});
        this.route('dashboard/main', {path: '/dashboard'});

        this.route('profile/main', {path: '/profile/:user_id'});
        this.route('change-password/main', {path: '/changePassword/:user_id'});

        this.route('account/main', {path: '/account/:user_id'});

        this.route('company/main', {path: '/company/:company_id'});
        this.route('company/search-company', {path: 'searchCompany'});
        this.route('company/new-company', {path: 'newCompany'});

        this.route('warehouse/new-warehouse', {path: 'newWarehouse'});
        this.route('warehouse/search-poi', {path: 'searchWarehouse'});
        this.route('warehouse/main', {path: '/warehouse/:poi_id'});

        this.route('port/new-poi', {path: 'newPort'});
        this.route('port/search-poi', {path: 'searchPort'});
        this.route('port/main', {path: '/port/:poi_id'});

        this.route('segment/segment-new', {path: 'newSegment'});
        this.route('segment/segment-search', {path: 'searchSegment'});
        this.route('segment/main', {path: 'segment/:segment_id'});

        this.route('stamp/new-stamp', {path: 'newStamp'});
        this.route('stamp/search-stamp', {path: 'searchStamp'});
        this.route('stamp/main', {path: '/stamp/:stamp_id'});

        this.route('vessel/new-record', {path: 'newVessel'});
        this.route('vessel/search-vessel', {path: 'searchVessel'});
        this.route('vessel/main', {path: '/vessel/:vessel_id'});

        this.route('charge/new-record', {path: 'newCharge'});
        this.route('charge/search-record', {path: 'searchCharge'});
        this.route('charge/main', {path: '/charge/:charge_id'});

        this.route('equipment-classification/new-record', {path: 'newEquipmentClassification'});
        this.route('equipment-classification/search-record', {path: 'searchEquipmentClassification'});
        this.route('equipment-classification/main', {path: '/equipmentClassification/:equipmentClassification_id'});

        this.route('equipment/new-record', {path: 'newEquipment'});
        this.route('equipment/search-record', {path: 'searchEquipment'});
        this.route('equipment/main', {path: '/equipment/:equipment_id'});

        this.route('template/new-record', {path: 'newTemplate'});
        this.route('template/search-record', {path: 'searchTemplate'});
        this.route('template/main', {path: '/template/:template_id'});

        this.route('voyage/new-record', {path: 'newVoyage'});
        this.route('voyage/search-record', {path: 'searchVoyage'});
        this.route('voyage/main', {path: '/voyage/:voyage_id'});

        this.route('booking/new-record', {path: 'newBooking'});
        this.route('booking/search-record', {path: 'searchBooking'});
        this.route('booking/main', {path: '/booking/:booking_id'});
        this.route('booking/search-shipments', {path: 'searchShipments'});

        this.route('document/search-record', {path: 'searchDocument'});
        this.route('document/main', {path: 'document/:document_id'});
        this.route('document/new-record', {path: 'newDocument'});
    });
});

export default Router;
