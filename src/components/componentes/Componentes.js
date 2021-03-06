import React, { Component } from 'react';
import axios from 'axios';
import './Componentes.css';
import Global from '../../Global';
import { Link } from 'react-router-dom';
import swal from 'sweetalert2';
class Componentes extends Component {

    state = {
        componentes: {},
        status: '0'
    }

    componentWillMount() {
        this.getComponentes();
    }

    getComponentes = () => {
        axios.get(Global.url + "componentes")
            .then(res => {
                this.setState({
                    componentes: res.data,
                    status: 'success'
                });
            });
    };

    deleteComponente = (idComponente) => {
        swal.fire({
            title: 'Estás seguro?',
            text: "No podrás revertir tu acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar!',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(Global.url + "componentes/" + idComponente)
                    .then(res => {
                        this.setState({
                            componente: res.data.componente,
                            status: 'deleted'
                        });
                        swal.fire(
                            'Componente eliminado!',
                            'El componente ha sido eliminado con éxito.',
                            'success'
                        ).then(() => {
                            window.location = "/componentes"
                        });
                    }).catch(() => {
                        swal.fire(
                            'Ooops...!',
                            'No se ha podido eliminar el componente...',
                            'error'
                        );
                    });
            };
        })
    }

    render() {
        if (this.state.componentes.length > 0) {
            var listComponentes = this.state.componentes.map((comp) => {
                return (
                    <div className="col" key={comp.id}>
                        <div className="card h-100">
                            <p className="card-text text-end p-2">
                                <span className="badge bg-success">
                                    {new Intl.NumberFormat("es-ES", {
                                        style: "currency", currency: "EUR"
                                    }).format(comp.precio)}
                                </span>
                            </p>
                            <img src={comp.imagen} alt={comp.nombre} className="card-img-top" />
                            <div className="card-body">
                                <h5 className="card-title">{comp.nombre}</h5>
                                <hr />
                                <p className="card-text">Categoría: {comp.categoria.nombre}
                                </p>
                                <p className="card-text">Fabricante: {comp.fabricante.nombre}
                                </p>
                            </div>
                            <div className="card-footer">
                                <p className="card-text text-center p-1">
                                    <a href={comp.url} className="btn btn-primary text-white" target="_blank" rel="noreferrer">
                                        <i aria-hidden="true" className="fa fa-info-circle"></i> Más información</a>
                                </p>
                                <div className="row text-center">
                                    <hr />
                                    <div className="col-6">
                                        <Link to={"/editar-componente/"+comp.id} className="btn btn-primary w-100">Editar
                                        </Link>
                                    </div>
                                    <div className="col-6">
                                        <button type="button" name="eliminar" className="btn btn-danger w-100" onClick={() => {
                                            this.deleteComponente(comp.id)
                                        }}>Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });

            return (
                <div id="componentes">
                    <h2 className="mb-3">Nuestros componentes</h2>

                    <div id="btn_crear" className="my-2">
                        <Link to="/crear-componente" className="btn btn-warning">Crear Componente</Link>
                    </div>

                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 justify-content-center">
                        {listComponentes}
                    </div>
                </div>
            )

        } else if (this.state.componentes.length === 0 && this.state.status === 'success') {
            return (
                <div className='justify-content-center alert alert-danger p-3 mt-3'>
                    <span><i className="fas fa-times"></i></span>
                    <h2>No hay componentes para mostrar.</h2>
                    <p>No se ha podido encontrar ningún componente.</p>
                </div>);

        } else {
            return (
                <div className='justify-content-center alert alert-danger p-3 mt-3'>
                    <span><i className="fas fa-spinner"></i></span>
                    <h2>Cargando...</h2>
                    <p>Espere mientras se carga el contenido.</p>
                </div>);
        }

    }
}

export default Componentes;