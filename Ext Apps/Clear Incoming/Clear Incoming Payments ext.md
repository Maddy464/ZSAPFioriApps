

https://extensibilityexplorer.cfapps.eu10.hana.ondemand.com/ExtensibilityExplorer/

![alt text]({0429B296-D957-4693-A4B1-2A8F761026A1}.png)

![alt text]({3809D236-5521-408D-BB1F-1A8C32D80C70}.png)

https://community.sap.com/t5/technology-blog-posts-by-sap/sap-fiori-for-sap-s-4hana-what-is-key-user-extensibility-and-who-are-your/ba-p/13560372#:~:text=Key%20user%20extensibility%20is%20a,directly%20in%20SAP%20Fiori%20apps%2C

https://help.sap.com/docs/SAP_S4HANA_CLOUD/918bca53037f408f91a2295d04ac16bc/aa935490094b441e9444ed74afba4d41.html


https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/#/detail/Apps('F0773')/S23OP

https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/3cb1182b4a184bdd93f8d62e3f1f0741/340f87546ccd9c62e10000000a445394.html?version=2021.002

https://www.scribd.com/document/850541675/In-App-Extension-Custom-Fields-and-Logic-S4HANA-On-Premise-Copia

![alt text]({D9E0158F-6B5F-436F-A5A3-181915462782}.png)


![alt text]({485115DD-25CF-4CE1-9834-C3165ACA3896}.png)

The reference key fields in the BSEG table in SAP are used to store additional information for line items to facilitate reporting and reconciliation, such as a predecessor document number or an external invoice number. These fields (like BSEG-XREF1 and BSEG-XREF3) are used to link financial documents to other SAP documents or external data. They can be populated manually or automatically based on system configuration and are often used in conjunction with other fields to create a unique payment reference. 

How reference keys are used

External reference: Store an external invoice number, such as when posting a vendor down payment, so the corresponding invoice can be easily identified later.

Predecessor document: Link the financial document to a predecessor document, such as a purchase order or a goods receipt from the MM module.

Payment reference: Use the reference key in combination with other fields to generate a payment reference for a specific transaction.

Reporting and analysis: Provide additional data points for reporting and analysis that are not available in standard line item reports.

Custom logic: Use reference keys as a way to pass information between different SAP modules or for custom logic in specific processes. 

Imagine a company receives an invoice from a vendor for a specific product. The vendor's invoice number is "INV-12345". When this invoice is processed in SAP, the user can enter "INV-12345" into the BSEG-ZUMSW (Reference key 1) field.
This provides the following benefits:
When viewing the document in SAP, the user can immediately see the vendor's invoice number in the "Reference key" field.
This allows them to quickly look up the original paper or electronic invoice if needed for an audit or for reconciliation.
A custom report could be created that pulls all transactions with a specific reference key, such as "INV-12345", making it easy to see all costs associated with that invoice.



Custom Fiori Tile is being created to provide additional fields into Clear Incoming Payments Fiori App. To achieve this need to enhance the OData service FAR_MANUAL_CLEARING and to add missing field ZZ1_XREF6_COB of corresponding structure FAC_S_ACCDOC_ITM_ODATA into FinsPostingAPARItem entity.


The OData service FAR_MANUAL_CLEARING is not done via SEGW project, but via /IWBEP/REG_SERVICE transaction. When trying to extend it with SEGW project, some entities/entity sets are being automatically disabled, when generating the project. Thus some functionality is broken.

![alt text](image.png)

Requirement :

We need to add the below additional selection parameters to the tile to fetch the new fields in the output report.
 Add Reference Key Fields (1, 2, 3, 6) to below section of Clear Incoming Payments screen. User will key data into these fields and on the new posted document these data fields would be populated.

 ![alt text](image-1.png)
 
AXX-200 testing screen shots :

Test 1

![alt text](image-2.png)

![alt text](image-3.png)

![alt text](image-4.png)

![alt text](image-5.png)

![alt text](image-6.png)

![alt text](image-7.png)

![alt text](image-8.png)

Test 2 - 

![alt text](image-9.png)

![alt text](image-10.png)

![alt text](image-11.png)

![alt text](image-12.png)

Journal posted successfully:

![alt text](image-13.png)

Journal posted successfully has the values for below reference key populated :

![alt text](image-14.png)

Tcode FB03 :

![alt text](image-15.png)

![alt text](image-16.png)

Test 3 :

![alt text]({8F52CDE7-0B94-4A95-9D40-5F4BF035E1BA}.png)
![alt text]({B55847DE-17E0-4075-9CCC-1D17FB25183A}.png)

![alt text]({31260786-081B-4643-B6AC-9C48E76FAF9E}.png)

![alt text]({922ADCAF-A6A2-47CD-B650-1D9B4922E5D3}.png)

FB03 display journal to view the reference key value update :

![alt text]({20FB676E-7591-41D9-A303-238757AB7E30}.png)

Extend the original OData Service FAR_MANUAL_CLEARING and add the necessary properties Zz1Xref6Cob, Zz1Xref6Cobf into the Entity FinsPostingAPARItem.

![alt text](image-17.png)


Remove ZGE_FAR_MANUAL_CLEARING project from SEGW. Delete classes ZGCL_GE_FAR_MANUAL_CLE_DPC_EXT
ZGCL_GE_FAR_MANUAL_CLE_MPC_EXT
ZGCL_GE_FAR_MANUAL_CLE_DPC
ZGCL_GE_FAR_MANUAL_CLE_MPC

Recreate class ZGCL_GE_FAR_MANUAL_CLE_DPC_EXT and put CL_FAR_MANUAL_CLEARING_DPC_EXT as superclass for it

Recreate class ZGCL_GE_FAR_MANUAL_CLE_MPC_EXT and put CL_FAR_MANUAL_CLEARING_MPC_EXT as superclass for it

Create new method CREATE_NEW_ARTIFACTS to add missing properties in metadata.

![alt text](image-18.png)

Redefine method DEFINE to call method CREATE_NEW_ARTIFACTS.
![alt text](image-19.png)

Run tcode /IWBEP/REG_SERVICE to ensure the config is done properly.

![alt text](image-20.png)














