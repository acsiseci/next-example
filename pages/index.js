import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useState, useEffect, useRef} from 'react';
import {classNames} from 'primereact/utils';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {InputTextarea} from 'primereact/inputtextarea';
import {RadioButton} from 'primereact/radiobutton';
import {InputNumber} from 'primereact/inputnumber';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {productService} from "../services/ProductService";

export default function Home() {
    let emptyProduct = {
        _id: null,
        name: '',
        description: '',
        category: null,
        price: 0,
        quantity: 0,
    };

    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);


    useEffect(() => {
        getAllProduct()
    }, []);

    const getAllProduct = () => {
        setLoading(true)
        productService.getAll().then(result => {
            setLoading(false)
            if (!result.errors) {
                setProducts(result.data)
                toast.current.show({severity: 'success', summary: 'Successful', detail: 'Products List', life: 3000});
            } else {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warn',
                    detail: result?.errors?.items[0]?.message,
                    life: 3000
                });
            }
        })
    }
    const createProduct = (values) => {
        setLoading(true)
        productService.create(values).then(result => {
            setLoading(false)
            if (!result.errors) {
                getAllProduct()
                toast.current.show({severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000});
            } else {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warn',
                    detail: result?.errors?.items[0]?.message,
                    life: 3000
                });
            }
        })
    }
    const updateProduct = (id, values) => {
        setLoading(true)
        productService.update(id, values).then(result => {
            setLoading(false)
            if (!result.errors) {
                getAllProduct()
                toast.current.show({severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
            } else {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warn',
                    detail: result?.errors?.items[0]?.message,
                    life: 3000
                });
            }
        })
    }
    const deleteProduct = (id) => {
        productService.delete(id).then(result => {
            if (!result.errors) {
                toast.current.show({severity: 'success', summary: 'Successful', detail: 'Products List', life: 3000});
            } else {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warn',
                    detail: result?.errors?.items[0]?.message,
                    life: 3000
                });
            }
            getAllProduct()
        })
    }

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }
    const editProduct = (product) => {
        setProduct({...product});
        setProductDialog(true);
    }
    const saveProduct = () => {
        setSubmitted(true);
        if (product._id) {
            updateProduct(product._id, product)
        } else {
            createProduct(product)
        }
        setProductDialog(false);
        setProduct(emptyProduct);
    }
    const removeProduct = () => {
        deleteProduct(product._id)
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }
    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const onCategoryChange = (e) => {
        let _product = {...product};
        _product['category'] = e.value;
        setProduct(_product);
    }
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = {...product};
        _product[`${name}`] = val;
        setProduct(_product);
    }
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = {...product};
        _product[`${name}`] = val;
        setProduct(_product);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2"
                        onClick={() => editProduct(rowData)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"
                        onClick={() => confirmDeleteProduct(rowData)}/>
            </React.Fragment>
        );
    }
    const priceBodyTemplate = (rowData) => {
        return rowData.price + ' ₺';
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Products</h5>
            <div className="flex justify-content-between flex-wrap card-container purple-container">
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText type="text"
                               onInput={(e) => setGlobalFilter(e.target.value == '' ? null : e.target.value)}
                               placeholder="Search..."/>
                </span>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew}/>
            </div>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct}/>
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog}/>
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={removeProduct}/>
        </React.Fragment>
    );

    return (
        <div>
            <Head>
                <title>Example Next App</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                <div>
                    <Toast ref={toast}/>
                    <div className="card">
                        <DataTable ref={dt} value={products} loading={loading}
                                   dataKey="_id" globalFilter={globalFilter}
                                   header={header} responsiveLayout="scroll">
                            <Column field="name" header="Name" sortable></Column>
                            <Column field="price" body={priceBodyTemplate} header="Price" sortable></Column>
                            <Column field="category" header="Category" sortable></Column>
                            <Column field="quantity" header="Quantity" sortable></Column>
                            <Column body={actionBodyTemplate} style={{minWidth: '8rem'}}></Column>
                        </DataTable>
                    </div>

                    <Dialog visible={productDialog} style={{width: '450px'}} header="Product Details" modal
                            className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')}
                                       required autoFocus
                                       className={classNames({'p-invalid': submitted && !product.name})}/>
                            {submitted && !product.name && <small className="p-error">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={product.description}
                                           onChange={(e) => onInputChange(e, 'description')} required rows={3}
                                           cols={20}/>
                        </div>

                        <div className="field">
                            <label className="mb-3">Category</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" name="category" value="Accessories"
                                                 onChange={onCategoryChange}
                                                 checked={product.category === 'Accessories'}/>
                                    <label htmlFor="category1">Accessories</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" name="category" value="Clothing"
                                                 onChange={onCategoryChange} checked={product.category === 'Clothing'}/>
                                    <label htmlFor="category2">Clothing</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category3" name="category" value="Electronics"
                                                 onChange={onCategoryChange}
                                                 checked={product.category === 'Electronics'}/>
                                    <label htmlFor="category3">Electronics</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category4" name="category" value="Fitness"
                                                 onChange={onCategoryChange} checked={product.category === 'Fitness'}/>
                                    <label htmlFor="category4">Fitness</label>
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Price</label>
                                <InputNumber id="price" value={product.price}
                                             onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency"
                                             currency="TRY" locale="tr-TR"/>
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Quantity</label>
                                <InputNumber id="quantity" value={product.quantity}
                                             onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly/>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{width: '450px'}} header="Confirm" modal
                            footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
                        </div>
                    </Dialog>
                </div>
            </main>

            <footer className={styles.footer}>
                <a href="https://github.com/acsiseci/next-example" target="_blank" rel="noopener noreferrer">
                    <i className="pi pi-github"></i>
                </a>
            </footer>
        </div>
    )
}
