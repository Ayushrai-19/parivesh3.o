import { useEffect, useMemo, useRef } from "react";
import maplibregl, { LngLatBoundsLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Feature, Point, Polygon, GeoJsonProperties } from "geojson";
import type { StyleSpecification } from "maplibre-gl";
import type { PublicProject } from "../services/workflowApi";

interface PublicProjects3DMapProps {
  projects: PublicProject[];
}

const EARTH_RADIUS_M = 6378137;
const REAL_WORLD_BASEMAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution:
        'Tiles &copy; <a href="https://www.esri.com/">Esri</a> | Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxzoom: 19,
    },
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
  },
  sprite: "https://tiles.openfreemap.org/sprites/ofm_f384/ofm",
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  layers: [
    {
      id: "satellite-base",
      type: "raster",
      source: "satellite",
      minzoom: 0,
      maxzoom: 19,
    },
    {
      id: "waterway-river-overlay",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      filter: ["all", ["==", ["get", "class"], "river"], ["!=", ["get", "brunnel"], "tunnel"]],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(120, 190, 255, 0.95)",
        "line-width": ["interpolate", ["exponential", 1.2], ["zoom"], 6, 0.6, 10, 1.2, 15, 3.5],
      },
    },
    {
      id: "roads-major-overlay",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary", "tertiary"], true, false],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(255, 214, 102, 0.92)",
        "line-width": ["interpolate", ["exponential", 1.2], ["zoom"], 5, 0.5, 8, 1.2, 12, 2.4, 16, 5.5],
      },
    },
    {
      id: "roads-minor-overlay",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      minzoom: 12,
      filter: ["match", ["get", "class"], ["minor", "street", "street_limited", "service"], true, false],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(255, 255, 255, 0.8)",
        "line-width": ["interpolate", ["exponential", 1.2], ["zoom"], 12, 0.5, 14, 1.4, 17, 3.8],
      },
    },
    {
      id: "building-3d-overlay",
      type: "fill-extrusion",
      source: "openmaptiles",
      "source-layer": "building",
      minzoom: 14,
      paint: {
        "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
        "fill-extrusion-height": ["coalesce", ["get", "render_height"], 8],
        "fill-extrusion-color": "rgba(221, 226, 232, 0.95)",
        "fill-extrusion-opacity": 0.82,
      },
    },
    {
      id: "road-labels-major",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "transportation_name",
      minzoom: 10,
      filter: ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary", "tertiary"], true, false],
      layout: {
        "symbol-placement": "line",
        "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 10, 10, 15, 13],
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "rgba(20, 24, 36, 0.9)",
        "text-halo-width": 1.4,
      },
    },
    {
      id: "place-labels",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      minzoom: 3,
      layout: {
        "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
        "text-font": ["Noto Sans Bold"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 3, 11, 8, 14, 12, 18],
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "rgba(12, 18, 28, 0.92)",
        "text-halo-width": 1.6,
      },
    },
  ],
};

const toRadians = (deg: number) => (deg * Math.PI) / 180;
const toDegrees = (rad: number) => (rad * 180) / Math.PI;

const computeCirclePolygon = (lng: number, lat: number, radiusM: number, points = 64) => {
  const angularDistance = radiusM / EARTH_RADIUS_M;
  const latRad = toRadians(lat);
  const lngRad = toRadians(lng);
  const coords: number[][] = [];

  for (let i = 0; i <= points; i += 1) {
    const bearing = (2 * Math.PI * i) / points;

    const lat2 = Math.asin(
      Math.sin(latRad) * Math.cos(angularDistance) +
      Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearing)
    );

    const lng2 =
      lngRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latRad),
        Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(lat2)
      );

    coords.push([toDegrees(lng2), toDegrees(lat2)]);
  }

  return [coords];
};

const riskColor = (band: string) => {
  if (band === "HIGH") return "#dc2626";
  if (band === "MODERATE") return "#d97706";
  return "#059669";
};

export function PublicProjects3DMap({ projects }: PublicProjects3DMapProps) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const { pointFeatures, circleFeatures } = useMemo(() => {
    const points: Feature<Point, GeoJsonProperties>[] = [];
    const circles: Feature<Polygon, GeoJsonProperties>[] = [];

    projects.forEach((project) => {
      points.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [project.map_lng, project.map_lat],
        },
        properties: {
          application_id: project.application_id,
          project_name: project.project_name,
          sector: project.sector,
          current_status: project.current_status,
          environmental_risk_score: project.environmental_risk_score,
          environmental_risk_band: project.environmental_risk_band,
          marker_color: riskColor(project.environmental_risk_band),
          circle_visible: project.circle_visible,
        },
      });

      if (project.circle_visible && project.circle_radius_m) {
        circles.push({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: computeCirclePolygon(project.map_lng, project.map_lat, project.circle_radius_m),
          },
          properties: {
            application_id: project.application_id,
            marker_color: riskColor(project.environmental_risk_band),
          },
        });
      }
    });

    return { pointFeatures: points, circleFeatures: circles };
  }, [projects]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: REAL_WORLD_BASEMAP_STYLE,
      center: [78.9629, 22.5937],
      zoom: 4.1,
      pitch: 55,
      bearing: -15,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    map.on("load", () => {
      map.addSource("public-project-points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: pointFeatures,
        },
      });

      map.addLayer({
        id: "public-project-point-layer",
        type: "circle",
        source: "public-project-points",
        paint: {
          "circle-radius": 7,
          "circle-color": ["get", "marker_color"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1.8,
          "circle-opacity": 0.9,
        },
      });

      map.addSource("public-project-circles", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: circleFeatures,
        },
      });

      map.addLayer({
        id: "public-project-circle-fill",
        type: "fill",
        source: "public-project-circles",
        paint: {
          "fill-color": ["get", "marker_color"],
          "fill-opacity": 0.18,
        },
      });

      map.addLayer({
        id: "public-project-circle-outline",
        type: "line",
        source: "public-project-circles",
        paint: {
          "line-color": ["get", "marker_color"],
          "line-width": 2,
          "line-opacity": 0.85,
        },
      });

      map.on("click", "public-project-point-layer", (event) => {
        const feature = event.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;
        const props = feature.properties || {};

        const html = `
          <div style="font-family:Segoe UI,Arial,sans-serif;min-width:220px;">
            <div style="font-weight:700;color:#111827;margin-bottom:4px;">${props.project_name || "Project"}</div>
            <div style="font-size:12px;color:#374151;">Sector: ${props.sector || "-"}</div>
            <div style="font-size:12px;color:#374151;">Status: ${String(props.current_status || "-").replace(/_/g, " ")}</div>
            <div style="font-size:12px;color:#374151;">Risk: ${props.environmental_risk_score || "-"} (${props.environmental_risk_band || "-"})</div>
            <div style="font-size:12px;color:#374151;">Zone Overlay: ${props.circle_visible ? "Enabled" : "Pending docs/payment"}</div>
          </div>
        `;

        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new maplibregl.Popup({ closeButton: true, closeOnClick: true })
          .setLngLat((feature.geometry.coordinates as number[]).slice(0, 2) as [number, number])
          .setHTML(html)
          .addTo(map);
      });

      map.on("mouseenter", "public-project-point-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "public-project-point-layer", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    mapRef.current = map;

    return () => {
      if (popupRef.current) popupRef.current.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [circleFeatures, pointFeatures]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const pointsSource = map.getSource("public-project-points") as maplibregl.GeoJSONSource | undefined;
    if (pointsSource) {
      pointsSource.setData({
        type: "FeatureCollection",
        features: pointFeatures,
      });
    }

    const circlesSource = map.getSource("public-project-circles") as maplibregl.GeoJSONSource | undefined;
    if (circlesSource) {
      circlesSource.setData({
        type: "FeatureCollection",
        features: circleFeatures,
      });
    }

    if (pointFeatures.length) {
      const bounds = new maplibregl.LngLatBounds();
      pointFeatures.forEach((feature) => {
        const coords = feature.geometry.coordinates as number[];
        bounds.extend([coords[0], coords[1]]);
      });
      map.fitBounds(bounds as LngLatBoundsLike, {
        padding: 40,
        duration: 750,
        maxZoom: 8,
      });
    }
  }, [circleFeatures, pointFeatures]);

  return <div ref={containerRef} className="h-full w-full" />;
}
