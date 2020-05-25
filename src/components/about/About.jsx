import React from 'react';
import { Segment, Grid, Button, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Grid>
      <Grid.Row centered>
        <Grid.Column width={10} textAlign='justified'>
          <Segment.Group>
            <Segment attached='top' textAlign='left'>
              <h3>
                Accompagner les entreprises françaises dans la lutte contre la
                déforestation importée
              </h3>
            </Segment>
            <Segment attached='bottom'>
              <h5>L'Alliance pour la Préservation des forêts</h5>
              <p>
                L’Alliance pour la Préservation des forêts (APF) est un
                collectif d’entreprises qui s’est donné pour objectif de «
                mettre fin à la déforestation importée ».
              </p>
              <p>
                Elle cherche à préserver les écosystèmes naturels en s’assurant
                du respect les droits de l’Homme. Elle travaille sur la question
                de la zéro déforestation tropicale et zéro Destruction ou
                conversion d’écosystèmes naturels remarquables » en liens avec
                les chaînes d’approvisionnement de ses membres. En plus du
                travail réalisé aligné avec la{' '}
                <a href='https://www.ecologique-solidaire.gouv.fr/sites/default/files/2018.11.14_dp_sndi_mtes.pdf'>
                  Stratégie Nationale de lutte contre la Déforestation Importée
                </a>{' '}
                (SNDI), elle cherche à lutter contre les « Exclusions sociales
                ».
              </p>

              <h5>Une cartographie des projets avec une approche paysagère</h5>
              <p>
                Ces approches cherchent à garantir plus de transparence et de
                durabilité. Marcel Djama du CIRAD présente une définition de ces
                approches territoire sur le site de l’Alliance : « Le
                développement territorialisé, c’est mobiliser l’ensemble des
                parties prenantes du territoire, les communautés locales,
                acteurs économiques, chaînes d’approvisionnement (huile de palme
                par exemple, bois, cacao, café), mobiliser ces acteurs dans une
                démarche de planification territoriale. Ne pas produire sur les
                zones forestières, produire dans un contexte de zéro
                déforestation, mettre des bonnes pratiques agronomiques
                conformes aux normes de durabilité. »
              </p>
              <p>
                Ce travail est le fruit d'une collaboration entre l'Alliance
                pour la préservaton des Forêts et le CIRAD. La liste des projets
                rassemble des initiatives portées par des organisations
                publiques, des ONG et des entreprises privées. Cette liste
                présente les résultats d'une revue bibliographique réalisée en
                Mai 2020. Elle a vocation a être partagée avec les membres de
                l'Alliance et tous les partenaires de l'Alliance, dans l'esprit
                de l'OpenData.
              </p>
              <Button color='blue' as={Link} to='/cartographie'>
                Voir la carte
              </Button>
              <Button as={Link} to='/projets'>
                Voir la liste des projets
              </Button>
            </Segment>
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default About;
