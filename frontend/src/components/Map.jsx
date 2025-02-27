import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MenuPopup from "./MenuPopup";
import { getRegionColor } from "../utils/map/formatMap";
import OccurrenceDetails from "./OccurenceDetails";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const createCustomIcon = (iconUrl) =>
  L.icon({
    iconUrl,
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [48, 48],
    iconAnchor: [12, 41],
    popupAnchor: [13, -40],
    shadowSize: [50, 50],
  });

const icons = {
  buraco: createCustomIcon("/icons/buraco.png"),
  iluminacao_publica: createCustomIcon("/icons/iluminacao.png"),
  add_ocorrencia: createCustomIcon("/icons/add-ocorrencia.png"),
  saude: createCustomIcon("/icons/instituicao-saude.png"),
  ensino: createCustomIcon("/icons/instituicao-ensino.png"),
  default: createCustomIcon("/icons/default.png"),
};

const getIcon = (name) => {
  if (!name) return icons["default"];
  return icons[name] || icons["default"];
};

const Map = ({
  occurrences,
  onOccurrenceAdded,
  regions,
  neighborhoods,
  institutions,
}) => {
  const maxRegionsTotal =
    regions?.reduce((acc, r) => {
      const total = Number(r.metricas?.total || r.ocorrencias?.total || 0);
      return total > acc ? total : acc;
    }, 0) || 0;

  const maxNeighborhoodTotal =
    neighborhoods?.reduce((acc, r) => {
      const total = Number(r.metricas?.total_ocorrencias || 0);
      return total > acc ? total : acc;
    }, 0) || 0;

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[-19.9191, -43.9387]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {occurrences?.map((ocorrencia, index) => {
          const [lng, lat] = ocorrencia.geom.coordinates;
          return (
            <OccurrenceDetails
              key={`${ocorrencia.id}-${index}`}
              occurrence={ocorrencia}
              position={[lat, lng]}
              icon={getIcon(ocorrencia?.tipo || ocorrencia?.problema?.tipo)}
            />
          );
        })}

        {institutions?.saude?.map((institution, index) => {
          const [lng, lat] = institution.coordenadas.coordinates;
          return (
            <Marker
              key={`saude-${institution.id}-${index}`}
              position={[lat, lng]}
              icon={getIcon("saude")}
            >
              <Popup>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {institution.nome}
                  </h3>
                  <p className="text-gray-700">
                    <strong>Distância:</strong> {institution.distancia} m
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {institutions?.ensino?.map((institution, index) => {
          const [lng, lat] = institution.coordenadas.coordinates;
          return (
            <Marker
              key={`ensino-${institution.id}-${index}`}
              position={[lat, lng]}
              icon={getIcon("ensino")}
            >
              <Popup>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {institution.nome}
                  </h3>
                  <p className="text-gray-700">
                    <strong>Distância:</strong> {institution.distancia} m
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Regiões */}
        {regions?.map((region, index) => {
          const { regiao, metricas, ocorrencias } = region;
          return (
            <GeoJSON
              key={`${regiao.id}-${index}`}
              data={regiao.geom}
              style={{
                fillColor: getRegionColor(
                  Number(metricas?.total || ocorrencias?.total),
                  maxRegionsTotal,
                  270
                ),
                fillOpacity: 0.7,
                color: "hsl(270, 100%, 30%)",
                weight: 2,
                opacity: 1,
              }}
              onEachFeature={(feature, layer) => {
                layer.bindPopup(
                  `<div>
                    <h3 class="font-bold">${regiao.nome}</h3>
                    <p>Total de Ocorrências: ${
                      metricas?.total || ocorrencias?.total
                    }</p>
                    ${
                      ocorrencias?.buracos
                        ? `<p>Número de ocorrências relacionada a buracos: ${ocorrencias?.buracos} ocorrências/km²</p>`
                        : ""
                    }

                    ${
                      ocorrencias?.iluminacao_publica
                        ? `<p>Número de ocorrências relacionada a buracos: ${ocorrencias?.iluminacao_publica} ocorrências/km²</p>`
                        : ""
                    }


                    ${
                      metricas?.densidade
                        ? `<p>Densidade: ${metricas?.densidade} ocorrências/km²</p>`
                        : ""
                    }
            
                  </div>`
                );
              }}
            />
          );
        })}

        {/* Bairros */}
        {neighborhoods?.map((neighborhood, index) => {
          const { bairro, metricas } = neighborhood;
          return (
            <GeoJSON
              key={`${bairro.id}-${index}`}
              data={bairro.geom}
              style={{
                fillColor: getRegionColor(
                  Number(metricas?.total_ocorrencias) || 0,
                  maxNeighborhoodTotal
                ),
                fillOpacity: 0.7,
                color: "hsl(240, 100%, 30%)",
                weight: 2,
                opacity: 1,
              }}
              onEachFeature={(feature, layer) => {
                layer.bindPopup(
                  `<div>
                    <h3 class="font-bold">${bairro.nome}</h3>
                    <p>Total de Ocorrências: ${metricas?.total_ocorrencias}</p>
                    ${
                      metricas?.densidade_km2
                        ? `<p>Densidade: ${metricas?.densidade_km2} ocorrências/km²</p>`
                        : ""
                    }
                  </div>`
                );
              }}
            />
          );
        })}

        {/* Botão para Adicionar Ocorrência */}
        <MenuPopup onAdd={onOccurrenceAdded} icon={getIcon("add_ocorrencia")} />
      </MapContainer>
    </div>
  );
};

export default Map;
