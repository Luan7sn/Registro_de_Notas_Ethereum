App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    $.getJSON('../students.json', function(data) {
      var studentRow = $('#studentRow');
      var studentTemplate = $('#studentTemplate');

      for (i = 0; i < data.length; i ++) {
        studentTemplate.find('.panel-title').text(data[i].name);
        studentTemplate.find('img').attr('src', data[i].picture);
        studentTemplate.find('.po-input').text(data[i].portugues);
        studentTemplate.find('.ma-input').text(data[i].matematica);
        studentTemplate.find('.ci-input').text(data[i].ciencias);
        studentTemplate.find('.btn-score').attr('data-id', data[i].id);

        studentRow.append(studentTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    
    if (window.ethereum) {
      
      App.web3Provider = window.ethereum;
      try {
        
        await window.ethereum.enable();
      } catch (error) {
        
        console.error("User denied account access")
      }
    }

    else if (window.web3) {
      
      App.web3Provider = window.web3.currentProvider;
    }

    else {
      
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    
    $.getJSON('Score.json', function(data) {
      
      var ScoreArtifact = data;
      App.contracts.Score = TruffleContract(ScoreArtifact);
    
      App.contracts.Score.setProvider(App.web3Provider);
    
      return App.showScore();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-score', App.receiveGrade);
  },

  showScore: function() {
    
    var scoreInstance;

    App.contracts.Score.deployed().then(function(instance) {
      
      scoreInstance = instance;

      return scoreInstance.getId.call();
    }).then(function(id) {

      for (i = 0; i < id.length; i++) {
        
        if (id[i] !== '0x0000000000000000000000000000000000000000') {
          
          //$('.panel-student').eq(i).find('button').text('Success').attr('disabled', true);

        }
      }
    }
    
    ).catch(function(err) {
  
      console.log(err.message);
    });

    App.contracts.Score.deployed().then(function(instance) {
      
      scoreInstance = instance;

      return scoreInstance.getPortugues.call();
    }).then(function(portugues) {

      for (i = 0; i < portugues.length; i++) {
        
        if (portugues[i].c[0] !== '0') {

          $('.panel-student').eq(i).find('#poScore').text(portugues[i].c[0]);
        }
      }
    }
    
    ).catch(function(err) {
  
      console.log(err.message);
    });

    App.contracts.Score.deployed().then(function(instance) {
      
      scoreInstance = instance;

      return scoreInstance.getMatematica.call();
    }).then(function(matematica) {

      for (i = 0; i < matematica.length; i++) {
        
        if (matematica[i].c[0] !== '0') {

          $('.panel-student').eq(i).find('#maScore').text(matematica[i].c[0]);
        }
      }
    }
    
    ).catch(function(err) {
  
      console.log(err.message);
    });

    App.contracts.Score.deployed().then(function(instance) {
      
      scoreInstance = instance;

      return scoreInstance.getCiencias.call();
    }).then(function(ciencias) {

      for (i = 0; i < ciencias.length; i++) {
        
        if (ciencias[i].c[0] !== '0') {
          
          $('.panel-student').eq(i).find('#ciScore').text(ciencias[i].c[0]);
        }
      }
    }
    
    ).catch(function(err) {
  
      console.log(err.message);
    });

  },

  receiveGrade: function(event) {
    event.preventDefault();

    var Id = parseInt($(event.target).data("id"));
    var poScore = document.getElementsByClassName("po-input")[Id].value;
    var maScore = document.getElementsByClassName("ma-input")[Id].value;
    var ciScore = document.getElementsByClassName("ci-input")[Id].value;

    var scoreInstance;

    web3.eth.getAccounts(function(error, accounts) {
      
      if (error) {
        
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Score.deployed().then(function(instance) {
        
        scoreInstance = instance;

        return scoreInstance.grade(Id, poScore, maScore, ciScore, {from: account});
      }).then(function(result) {
    
        return App.showScore();
      }).catch(function(err) {
    
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
