// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./ConfidentialStore.sol";

contract Marketplace {
    ConfidentialStore store;
    address[] public addressList = [Suave.ANYALLOWED];

    function setUp() public {
        store = new ConfidentialStore();
    }

    function storeData() public {
        // This function tests that we can create new data records and fetch them
        store.newDataRecord(0, addressList, addressList, "namespace");
        store.newDataRecord(0, addressList, addressList, "namespace1");
        store.newDataRecord(1, addressList, addressList, "namespace");

        // fetch the records
        // Suave.DataRecord[] memory records = store.fetchDataRecords(0, "namespace");
        // assertEq(records.length, 1);

        // records = store.fetchDataRecords(0, "namespace1");
        // assertEq(records.length, 1);

        // records = store.fetchDataRecords(1, "namespace");
        // assertEq(records.length, 1);

        // add more entries to 'namespace'
        // store.newDataRecord(0, addressList, addressList, "namespace");
        // store.newDataRecord(0, addressList, addressList, "namespace");

        // records = store.fetchDataRecords(0, "namespace");
        // assertEq(records.length, 3);
    }

    function retrieve(int dataId, string memory key) public view returns (bytes memory) {
        Suave.DataId id = Suave.DataId.wrap(bytes16(keccak256(abi.encodePacked(dataId))));

        bytes memory found = store.confidentialRetrieve(id, key);
        // assertEq(keccak256(found), keccak256(value));
        return found;
    }

    function genDataId(int64 recordsNum) public pure returns (Suave.DataId) {
        return Suave.DataId.wrap(bytes16(keccak256(abi.encodePacked(recordsNum))));
    }

    function genKey(uint decryptionCondition, string memory dataType) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(decryptionCondition, dataType));

    }


    function fetchDataRecords(uint cond, string memory dataType) public view returns (Suave.DataRecord[] memory) {
        return fetchDataRecords(cond, dataType);
    }

    // function testMockConfidentialStoreLocalAllowedAddress() public {
    //     // This function tests that we can store and retrieve a value from the record
    //     address[] memory allowed = new address[](1);
    //     allowed[0] = address(this);

    //     Suave.DataRecord memory record = store.newDataRecord(0, allowed, allowed, "namespace");

    //     bytes memory value = abi.encodePacked("value");
    //     store.confidentialStore(record.id, "key1", value);

    //     // test that another address cannot store
    //     // vm.startPrank(0x0000000000000000000000000000000000000000);
    //     // vm.expectRevert();
    //     store.confidentialStore(record.id, "key1", value);
    //     // vm.stopPrank();
    // }

    // function testMockConfidentialStoreReset() public {
    //     // add one record and one stored value
    //     Suave.DataRecord memory record = store.newDataRecord(0, addressList, addressList, "namespace");
    //     bytes memory value = abi.encodePacked("value");
    //     store.confidentialStore(record.id, "key1", value);

    //     bytes memory found = store.confidentialRetrieve(record.id, "key1");
    //     // assertEq(keccak256(found), keccak256(value));

    //     // reset the store
    //     store.reset();

    //     // it reverts because it cannot find the metadata of 'record'.
    //     // vm.expectRevert();
    //     store.confidentialRetrieve(record.id, "key1");

    //     Suave.DataRecord[] memory records = store.fetchDataRecords(0, "namespace");
    //     // assertEq(records.length, 0);

    //     // validate that if we add new records we can reset again
    //     store.newDataRecord(0, addressList, addressList, "namespace");

    //     records = store.fetchDataRecords(0, "namespace");
    //     // assertEq(records.length, 1);

    //     store.reset();

    //     records = store.fetchDataRecords(0, "namespace");
    //     // assertEq(records.length, 0);
    // }
}
