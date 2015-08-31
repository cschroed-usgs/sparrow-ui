/* global expect */

define([
	"sinon",
	'collections/ModelCollection',
	'underscore'
], function (sinon, ModelCollection, _) {
	describe("ModelCollection", function () {

		var json = {"total": 27, "took": "10ms", "selflink": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/items?max=1000&format=json&fields=tags&parentId=55c90c3be4b08400b1fd88a2"}, "items": [{"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e12e4b0518e35468a7f"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e12e4b0518e35468a7f", "rel": "related"}}, "id": "55d22e12e4b0518e35468a7f", "tags": [{"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "East Coast"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "New"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Super-Region"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TN"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e11e4b0518e35468a71"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e11e4b0518e35468a71", "rel": "related"}}, "id": "55d22e11e4b0518e35468a71", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "national_e2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Conterminous US"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "22"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Conterminous US"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TN"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e12e4b0518e35468a89"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e12e4b0518e35468a89", "rel": "related"}}, "id": "55d22e12e4b0518e35468a89", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "mrb02_mrbe2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Southeast (MRB2)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "49"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TP"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e13e4b0518e35468a91"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e13e4b0518e35468a91", "rel": "related"}}, "id": "55d22e13e4b0518e35468a91", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "mrb04_mrbe2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Missouri (MRB4)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "58"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TP"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e14e4b0518e35468a9f"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e14e4b0518e35468a9f", "rel": "related"}}, "id": "55d22e14e4b0518e35468a9f", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "chesa_nhd"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Chesapeake Bay"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "54"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Sub- Region"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TN"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e14e4b0518e35468aa5"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e14e4b0518e35468aa5", "rel": "related"}}, "id": "55d22e14e4b0518e35468aa5", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "national_e2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Southwestern US"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "53"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Sub- Region"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TDS"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e14e4b0518e35468a9d"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e14e4b0518e35468a9d", "rel": "related"}}, "id": "55d22e14e4b0518e35468a9d", "tags": [{"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "California (MRB8)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "New"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TP"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e11e4b0518e35468a73"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e11e4b0518e35468a73", "rel": "related"}}, "id": "55d22e11e4b0518e35468a73", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "national_e2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Conterminous US"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "23"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Conterminous US"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TP"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e12e4b0518e35468a7d"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e12e4b0518e35468a7d", "rel": "related"}}, "id": "55d22e12e4b0518e35468a7d", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "marb_mrbe2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Mississippi"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "38"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Super-Region"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TP"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e12e4b0518e35468a87"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e12e4b0518e35468a87", "rel": "related"}}, "id": "55d22e12e4b0518e35468a87", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "mrb02_mrbe2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Southeast (MRB2)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "50"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TN"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e13e4b0518e35468a93"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e13e4b0518e35468a93", "rel": "related"}}, "id": "55d22e13e4b0518e35468a93", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "mrb05_mrbe2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Lower Midwest (MRB5)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "35"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TN"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e14e4b0518e35468aa3"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e14e4b0518e35468aa3", "rel": "related"}}, "id": "55d22e14e4b0518e35468aa3", "tags": [{"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Chesapeake Bay"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "New"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Sub- Region"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "Susp. Sediment"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e14e4b0518e35468a9b"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e14e4b0518e35468a9b", "rel": "related"}}, "id": "55d22e14e4b0518e35468a9b", "tags": [{"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "California (MRB8)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "New"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TN"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e11e4b0518e35468a75"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e11e4b0518e35468a75", "rel": "related"}}, "id": "55d22e11e4b0518e35468a75", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "national_e2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Conterminous US"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "30"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Conterminous US"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "Susp. Sediment"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e12e4b0518e35468a7b"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e12e4b0518e35468a7b", "rel": "related"}}, "id": "55d22e12e4b0518e35468a7b", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "marb_mrbe2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Mississippi"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "37"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Super-Region"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TN"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e12e4b0518e35468a85"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e12e4b0518e35468a85", "rel": "related"}}, "id": "55d22e12e4b0518e35468a85", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "mrb01_nhd"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Northeast (MRB1)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "52"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TP"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e13e4b0518e35468a95"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e13e4b0518e35468a95", "rel": "related"}}, "id": "55d22e13e4b0518e35468a95", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "mrb05_mrbe2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Lower Midwest (MRB5)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "36"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TP"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e14e4b0518e35468aa1"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e14e4b0518e35468aa1", "rel": "related"}}, "id": "55d22e14e4b0518e35468aa1", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "chesa_nhd"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Chesapeake Bay"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "55"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Sub- Region"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TP"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e11e4b0518e35468a77"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e11e4b0518e35468a77", "rel": "related"}}, "id": "55d22e11e4b0518e35468a77", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "national_mrb_e2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Conterminous US"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "25"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Conterminous US"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TDS"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e12e4b0518e35468a83"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e12e4b0518e35468a83", "rel": "related"}}, "id": "55d22e12e4b0518e35468a83", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "mrb01_nhd"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Northeast (MRB1)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "51"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TN"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e13e4b0518e35468a8d"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e13e4b0518e35468a8d", "rel": "related"}}, "id": "55d22e13e4b0518e35468a8d", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "mrb03_mrbe2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Upper Midwest (MRB3)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "42"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TP"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e13e4b0518e35468a97"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e13e4b0518e35468a97", "rel": "related"}}, "id": "55d22e13e4b0518e35468a97", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "mrb07_mrbe2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Pacific Northwest (MRB7)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "43"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TN"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e12e4b0518e35468a8b"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e12e4b0518e35468a8b", "rel": "related"}}, "id": "55d22e12e4b0518e35468a8b", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "mrb03_mrbe2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Upper Midwest (MRB3)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "41"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TN"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e12e4b0518e35468a81"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e12e4b0518e35468a81", "rel": "related"}}, "id": "55d22e12e4b0518e35468a81", "tags": [{"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "East Coast"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "New"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Super-Region"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TP"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e11e4b0518e35468a79"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e11e4b0518e35468a79", "rel": "related"}}, "id": "55d22e11e4b0518e35468a79", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "national_mrb_e2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Conterminous US"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "24"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Conterminous US"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TOC"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e13e4b0518e35468a8f"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e13e4b0518e35468a8f", "rel": "related"}}, "id": "55d22e13e4b0518e35468a8f", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "mrb04_mrbe2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Missouri (MRB4)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "57"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TN"}]}, {"link": {"rel": "self", "url": "https://www.sciencebase.gov/catalog/item/55d22e13e4b0518e35468a99"}, "relatedItems": {"link": {"url": "https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e13e4b0518e35468a99", "rel": "related"}}, "id": "55d22e13e4b0518e35468a99", "tags": [{"type": "regionId", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region-id", "name": "mrb07_mrbe2rf1"}, {"type": "region", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/region", "name": "Pacific Northwest (MRB7)"}, {"type": "id", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/sparrow-id", "name": "44"}, {"type": "extent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/extent", "name": "Region (MRB) - Default for state selection"}, {"type": "constituent", "scheme": "https://www.sciencebase.gov/vocab/SPARROW/constituent", "name": "TP"}]}]};
		var coll;

		beforeEach(function () {
			this.server = sinon.fakeServer.create();
			this.server.respondWith("GET", "data/model", [
				200,
				{"Content-Type": "application/json"},
				JSON.stringify(json)
			]);

			coll = new ModelCollection();
			coll.fetch();
			this.server.respond();
		});

		it("properly fetches models", function () {

			expect(coll.models.length).toBeGreaterThan(0);
			expect(coll.models.length).toBe(22);
			expect(_.findIndex(coll.models, function (m) {
				return m.attributes = {
					id: '50',
					sbId: '55ce4032e4b01487cbfc70d4',
					link: {
						rel: 'self',
						url: 'https://www.sciencebase.gov/catalog/item/55ce4032e4b01487cbfc70d4'
					},
					relatedLink: 'https://www.sciencebase.gov/catalog/itemLinks?itemId=55ce4032e4b01487cbfc70d4',
					region: 'Southeast (MRB2)',
					extent: 'Region (MRB) - Default for state selection',
					constituent: 'TN'
				};
			})).not.toBe(-1);
		});

		it('getConstituents returns all constituents if not filtered by region', function () {
			var c = _.map(coll.getConstituents(), function (c) {
				return c.name;
			});
			expect(c.length).toBe(5);
			expect(c).toContain('TN');
			expect(c).toContain('TP');
			expect(c).toContain('TDS');
			expect(c).toContain('Susp. Sediment');
			expect(c).toContain('TOC');
		});

		it('getConstituents returns relevant constituents if filtered by region', function () {
			var c = _.map(coll.getConstituents('mrb04_mrbe2rf1'), function (c) {
				return c.name;
			});
			expect(c.length).toBe(2);
			expect(c).toContain('TN');
			expect(c).toContain('TP');
		});

		it('getConstituents returns empty array if filtered by a invalid region', function () {
			var c = _.map(coll.getConstituents('No Region'), function (c) {
				return c.name;
			});
			expect(c.length).toBe(0);
		});

		it('getRegions returns all regions if not filtered by constituent', function () {
			var r = _.map(coll.getRegions(), function (c) {
				return c.name;
			});
			expect(r.length).toBe(10);
			expect(r).toContain('Conterminous US');
			expect(r).toContain('Southeast (MRB2)');
			expect(r).toContain('Missouri (MRB4)');
			expect(r).toContain('Chesapeake Bay');
			expect(r).toContain('Mississippi');
			expect(r).toContain('Lower Midwest (MRB5)');
			expect(r).toContain('Northeast (MRB1)');
			expect(r).toContain('Upper Midwest (MRB3)');
			expect(r).toContain('Pacific Northwest (MRB7)');
		});

		it('getRegions returns relevant regions if filtered by constituent', function () {
			var r = _.map(coll.getRegions("TDS"), function (c) {
				return c.name;
			});
			expect(r.length).toBe(2);
			expect(r).toContain('Southwestern US');
			expect(r).toContain('Conterminous US');
		});

		it('Expects getRegions to return an empty array if filtered by a invalid constituent', function () {
			var r = _.map(coll.getRegions("no constituent"), function (c) {
				return c.name;
			});
			expect(r.length).toBe(0);
		});

		it('Expects getId to return the model id for the region and constituent', function () {
			expect(coll.getId('TN', 'mrb04_mrbe2rf1')).toEqual('57');
			expect(coll.getId('TDS', 'mrb04_mrbe2rf1')).not.toBeDefined();
			expect(coll.getId('', '')).not.toBeDefined();
			expect(coll.getId('TN', '')).not.toBeDefined();
		});

		it('Expects getModel to return the model which has an id of modelId', function() {
			expect(coll.getModel('57').attributes).toEqual({
					id: '57',
					title: undefined,
					sbId: '55d22e13e4b0518e35468a8f',
					link: {
						rel: 'self',
						url: 'https://www.sciencebase.gov/catalog/item/55d22e13e4b0518e35468a8f'
					},
					relatedLink: 'https://www.sciencebase.gov/catalog/itemLinks?itemId=55d22e13e4b0518e35468a8f',
					region: 'Missouri (MRB4)', extent: 'Region (MRB) - Default for state selection',
					constituent: 'TN',
					regionId: 'mrb04_mrbe2rf1'
			});
		});

		it('Expects getModel to return undefined if modelId is not in the collection', function() {
			expect(coll.getModel('junk')).not.toBeDefined();
		});

		afterEach(function () {
			this.server.restore();
		});
	});
});