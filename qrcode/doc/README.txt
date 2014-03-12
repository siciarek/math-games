RESOURCES:
    http://www.thonky.com/qr-code-tutorial
    http://www.swetake.com/qrcode/qr1_en.html
    http://www.qrme.co.uk/qr-code-resources/understanding-a-qr-code.html

DONE:
    - creating generator polynominal dynamically
    - putting data for version 2
    - numeric format support

TODO:
    - putting data for versions 2+

Level L (Low) 7% of codewords can be restored.
Level M (Medium) 15% of codewords can be restored.
Level Q (Quartile) 25% of codewords can be restored.
Level H (High) 30% of codewords can be restored.


Data Analysys
-------------

    Input:
        - Raw Data
        - Error Correction Strategy

    Output:
        - Mode
        - Version
        - Error Correction Level


Data Encoding
-------------

    Input:
        - Raw Data
        - Mode
        - Version

    Output:
        - Encoded Data Blocks


Calculation of Error Correction Code
------------------------------------

    Input:
        - Encoded Data Blocks

    Output:
        - Error Correction Code Blocks


Create QrCode Matrix with fixed and reserved areas set
------------------------------------------------------

    Input:
        - Version

    Output:
        - QrCode Matrix with static and reserved areas set


Place Encoded Data inside the QrCode Matrix
-------------------------------------------

    Input:
        - Encoded Data Blocks
        - Error Correction Code Blocks
        - QrCode Matrix

    Output:
        - QrCode Matrix filled with Encded Data and Error Correction Code


Apply Mask on QrCode Matrix
---------------------------

    Input:
        - QrCode Matrix

    Output:
        - QrCode Matrix with Mask applied


Update QrCode with Format Information and Version Information
-------------------------------------------------------------

    Input:
        - QrCode Matrix
        - Version
        - Mask Pattern Number

    Output:
        - QrCode Matrix Complete
